# Pendientes de integracion frontend/backend

Estos puntos no se conectaron completamente porque falta endpoint o contrato de datos en el backend actual:

- Datos tecnicos: existe `POST /usuarios/:id_tecnico/datos-tecnicos` y `PATCH /usuarios/:id/detalles-tecnicos`, pero no hay `GET` para leer los detalles completos del tecnico autenticado. El frontend usa promedio/top tecnicos cuando aplica y deja campos no expuestos como licencia/zona sin precargar.
- Disponibilidad semanal: el backend solo expone `detalles_tecnicos.disponible`; no existe CRUD para bloques de agenda por dia/hora. La pantalla actual actualiza disponibilidad global.
- Pagos admin: no existe `GET /pagos` global. Las vistas admin de pagos e ingresos derivan datos consultando pagos por cada solicitud.
- Solicitud detalle: `GET /solicitudes-servicio/:id` no incluye direccion completa; las listas de tecnico si entregan `direccion_servicio`. Algunos detalles muestran el id o texto de fallback cuando el endpoint no trae direccion.
- Comentarios: el backend tiene endpoints y el frontend tiene `comentarios.service.ts`, pero no existe pantalla dedicada de comentarios en la estructura actual.
- Auditoria/configuracion: no hay endpoints administrativos para eventos de auditoria ni configuracion remota; las pantallas quedan como estado informativo.
