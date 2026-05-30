# Pendientes de integracion frontend/backend

Estado despues del ajuste de integracion:

- Datos tecnicos: agregado `GET /usuarios/me/detalles-tecnicos` y `GET /usuarios/:id/detalles-tecnicos`; el service del frontend ya expone funciones de lectura.
- Pagos admin: agregado `GET /pagos` global protegido para admin; el service del frontend ya tiene `listPagos`.
- Solicitud detalle: `GET /solicitudes-servicio/:id` ahora incluye direccion, tipo de edificio, informacion y nota.
- Comentarios: agregada pantalla dedicada en `/admin/comentarios` y se mantiene `comentarios.service.ts`.
- Auditoria/configuracion: agregados endpoints informativos `GET /admin/auditoria` y `GET /admin/configuracion`.
- Disponibilidad semanal: agregada tabla `disponibilidad_tecnicos`, migracion, DTOs y endpoints `GET/POST /disponibilidad/me`, `GET/POST /disponibilidad/tecnico/:id_tecnico`, `PATCH/DELETE /disponibilidad/:id`; la pantalla del tecnico ya lista y crea bloques por dia/hora.
