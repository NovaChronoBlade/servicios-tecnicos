# Flujo del sistema y endpoints

Este documento describe el flujo principal (solicitudes, asignación, trabajo, confirmaciones, pagos y calificaciones) y los endpoints asociados.

## Resumen de roles
- CLIENTE
- TECNICO
- ADMIN

## 1. Crear solicitud (Cliente)
- Flujo:
  1. Cliente selecciona servicio y dirección.
  2. Se crea la solicitud en estado `pendiente`.
- Endpoint:
  - POST /solicitudes-servicio
  - Body: { id_cliente, id_servicio, id_direccion, id_tecnico? }
  - Roles: CLIENTE, ADMIN

## 2. Listar solicitudes (Admin)
- Endpoint:
  - GET /solicitudes-servicio
  - Roles: ADMIN

## 3. Obtener solicitud por ID
- Endpoint:
  - GET /solicitudes-servicio/:id
  - Roles: (Autenticado)

## 4. Buscar por estado (Admin)
- Endpoint:
  - GET /solicitudes-servicio/estado?estado=pendiente
  - Roles: ADMIN

## 5. Buscar solicitudes por cliente / técnico
- Endpoint:
  - GET /solicitudes-servicio/cliente/:id_cliente  (Roles: CLIENTE, ADMIN)
  - GET /solicitudes-servicio/tecnico/:id_tecnico  (Roles: TECNICO, ADMIN)

## 6. Asignar técnico
- Flujo:
  - Solo se puede asignar si la solicitud está en `pendiente`.
  - Permiso: ADMIN o el técnico que se asigna a sí mismo.
  - Al asignar, el estado pasa a `aceptado` y la disponibilidad del técnico (`detalles_tecnicos.disponible`) se pone en `false`.
- Endpoint:
  - PATCH /solicitudes-servicio/:id/asignar-tecnico/:id_tecnico
  - Roles: TECNICO (para auto-assign), ADMIN

## 6.1 Solicitudes pendientes disponibles para técnicos
- Propósito: permitir que técnicos vean las solicitudes que están en `pendiente` y no tienen técnico asignado, para poder aceptarlas.
- Endpoint:
  - GET /solicitudes-servicio/pendientes-disponibles
  - Roles: TECNICO, ADMIN
- Respuesta (ejemplo):
  ```json
  [
    {
      "id_ss": "SS-87947373",
      "estado": "pendiente",
      "fecha": "2026-05-25T00:02:50.720Z",
      "id_cliente": "USR-CLI-123",
      "nombre_cliente": "Juan Pérez",
      "nombre_servicio": "Instalación de aire acondicionado",
      "precio_servicio": "150000",
      "direccion_servicio": "Calle Falsa 123",
      "tipo_edificio": "Departamento"
    }
  ]
  ```


## 7. Actualizar estado (Técnico / Admin)
- Reglas de transición (estrictas):
  - `pendiente` -> `aceptado` | `cancelado`
  - `aceptado` -> `en_curso` | `cancelado`
  - `en_curso` -> `completado` | `cancelado`
  - `completado` y `cancelado` son estados terminales
- Endpoint:
  - PATCH /solicitudes-servicio/:id/estado
  - Body: { estado }
  - Roles: TECNICO, ADMIN

## 8. Confirmación dual de finalización
- Flujo:
  - Tanto cliente como técnico deben confirmar la finalización.
  - Campos en la BD (propuesta): `confirmacion_cliente`, `confirmacion_tecnico` (booleans).
  - Cuando ambos confirman, la solicitud pasa a `completado` y la disponibilidad del técnico vuelve a `true`.
- Endpoints:
  - PATCH /solicitudes-servicio/:id/confirmar/cliente  (Roles: CLIENTE)
  - PATCH /solicitudes-servicio/:id/confirmar/tecnico  (Roles: TECNICO)

## 9. Pagos
- Flujo:
  - Cada solicitud puede tener un pago asociado.
  - Solo el cliente propietario puede crear el pago.
  - No se permiten pagos duplicados por solicitud.
- Endpoints:
  - POST /pagos  Body: { id_ss, monto, metodo_pago }  (Roles: CLIENTE, ADMIN)
  - GET /pagos/:id  (Roles: Autenticado)
  - PATCH /pagos/:id/estado  Body: { estado }  (Roles: ADMIN)

## 10. Calificaciones
- Flujo:
  - Solo clientes pueden calificar una solicitud con estado `completado`.
  - Una sola calificación por solicitud.
  - Al crear calificación se recalcula el `calificacion_promedio` en `detalles_tecnicos`.
- Endpoints (existentes):
  - POST /calificaciones
  - GET /calificaciones/:id
  - GET /calificaciones/tecnico/:id_tecnico
  - GET /calificaciones/cliente/:id_cliente

## Notas de implementación
- Se usa SQL puro vía `prisma.$queryRaw` y `prisma.$executeRaw` para mantener la arquitectura basada en SQL puro.
- Propuesta de migración (no aplicada): `prisma/proposed_migrations/20260524_add_confirmaciones.sql`.
- Antes de aplicar cualquier migración en la BD se requiere tu autorización explícita.
