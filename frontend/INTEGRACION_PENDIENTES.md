# Pendientes de integracion frontend/backend

Estado despues del ajuste de integracion:

- Datos tecnicos: agregado `GET /usuarios/me/detalles-tecnicos` y `GET /usuarios/:id/detalles-tecnicos`; el service del frontend ya expone funciones de lectura.
- Pagos admin: agregado `GET /pagos` global protegido para admin; el service del frontend ya tiene `listPagos`.
- Solicitud detalle: `GET /solicitudes-servicio/:id` ahora incluye direccion, tipo de edificio, informacion y nota.
- Comentarios: agregada pantalla dedicada en `/admin/comentarios` y se mantiene `comentarios.service.ts`.
- Auditoria/configuracion: agregados endpoints informativos `GET /admin/auditoria` y `GET /admin/configuracion`.
- Disponibilidad semanal: queda pendiente como agenda real porque no existe tabla/modelo para bloques por dia/hora; el alcance actual sigue usando `detalles_tecnicos.disponible` como disponibilidad global.
