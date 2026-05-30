# Pendientes de integracion frontend/backend

Estado despues del ajuste de integracion:

- Datos tecnicos: agregado `GET /usuarios/me/detalles-tecnicos` y `GET /usuarios/:id/detalles-tecnicos`; el service del frontend ya expone funciones de lectura.
- Pagos admin: agregado `GET /pagos` global protegido para admin; el service del frontend ya tiene `listPagos`.
- Solicitud detalle: `GET /solicitudes-servicio/:id` ahora incluye direccion, tipo de edificio, informacion y nota.
- Comentarios: agregada pantalla dedicada en `/admin/comentarios` y se mantiene `comentarios.service.ts`.
- Auditoria/configuracion: agregados endpoints informativos `GET /admin/auditoria` y `GET /admin/configuracion`.
- Disponibilidad semanal: agregada tabla `disponibilidad_tecnicos`, migracion, DTOs y endpoints `GET/POST /disponibilidad/me`, `GET/POST /disponibilidad/tecnico/:id_tecnico`, `PATCH/DELETE /disponibilidad/:id`; la pantalla del tecnico ya lista y crea bloques por dia/hora.
- Solicitudes/pago: agregado `POST /solicitudes-servicio/checkout` para pagar primero y crear la solicitud solo si la pasarela aprueba; el frontend selecciona tecnico disponible, direccion, fecha y metodo de pago antes de crear.
- Estados de solicitud: agregado estado `asignado`, reglas centralizadas de transicion, `fecha_aceptacion` y `fecha_finalizacion`; cliente, tecnico y admin usan acciones segun estado.
- Mis solicitudes cliente: agregado detalle `/mis-solicitudes/:id` con tecnico asignado, especialidad, fecha de aceptacion, pago y finalizacion por cliente cuando la solicitud esta `en_curso`.
