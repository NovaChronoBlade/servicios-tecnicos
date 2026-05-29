# Documentacion del proyecto

## Descripcion del sistema

La plataforma de servicios tecnicos a domicilio conecta clientes con tecnicos registrados. El backend esta construido con NestJS, Prisma y PostgreSQL, y cubre autenticacion, usuarios, direcciones, servicios, solicitudes, pagos, calificaciones y comentarios.

## Casos de uso principales

| Caso de uso | Actor | Resumen |
|---|---|---|
| Registrarse e iniciar sesion | Cliente, tecnico, admin | El usuario crea cuenta o inicia sesion y recibe tokens de acceso. |
| Gestionar direcciones | Cliente | El cliente crea, consulta, actualiza o elimina sus direcciones. |
| Solicitar servicio | Cliente | El cliente selecciona servicio, direccion y fecha programada. |
| Atender solicitud | Tecnico | El tecnico consulta solicitudes disponibles y acepta una solicitud. |
| Administrar plataforma | Admin | El administrador gestiona usuarios, servicios, pagos y reasignaciones. |
| Calificar servicio | Cliente | El cliente califica y comenta una solicitud propia. |

## Modelo entidad-relacion

El modelo se compone de estas entidades principales:

- `usuarios`
- `detalles_tecnicos`
- `direcciones`
- `categorias_servicios`
- `servicios`
- `solicitud_servicios`
- `pagos`
- `calificaciones`
- `comentarios`
- `refresh_tokens`
- `revoked_access_tokens`

El diagrama ER debe incluirse como imagen en el documento final del proyecto. Si la imagen se guarda en el repositorio, se puede referenciar como `Diagrama_ER.png`.

## Diccionario de datos resumido

| Tabla | Campos principales | Proposito |
|---|---|---|
| `usuarios` | `id_usuario`, `documento`, `nombre`, `correo`, `telefono`, `rol`, `activo` | Guarda clientes, tecnicos y administradores. |
| `detalles_tecnicos` | `id_usuario`, `especialidad`, `licencia_profesional`, `disponible`, `calificacion_promedio` | Perfil extendido de tecnicos. |
| `direcciones` | `id_direccion`, `id_usuario`, `direccion`, `tipo_edificio`, `es_default` | Direcciones de clientes. |
| `categorias_servicios` | `id_categoria`, `nombre`, `descripcion`, `activo` | Clasificacion de servicios. |
| `servicios` | `id_servicio`, `nombre`, `descripcion`, `precio`, `activo`, `id_categoria` | Catalogo de servicios. |
| `solicitud_servicios` | `id_ss`, `id_cliente`, `id_tecnico`, `id_servicio`, `id_direccion`, `estado`, `fecha_programada` | Solicitudes creadas por clientes. |
| `pagos` | `id_pago`, `id_ss`, `monto`, `metodo_pago`, `estado`, `numero_referencia` | Pagos asociados a solicitudes. |
| `calificaciones` | `id_calificacion`, `id_tecnico`, `id_cliente`, `id_ss`, `puntuacion` | Calificaciones de servicios. |
| `comentarios` | `id_comentario`, `id_tecnico`, `id_cliente`, `id_ss`, `contenido` | Comentarios sobre solicitudes. |

## Restricciones y reglas de negocio

- `documento`, `correo` y `telefono` son unicos en `usuarios`.
- `rol` solo puede ser `cliente`, `tecnico` o `admin`.
- El precio de un servicio debe ser mayor o igual a `0.01`.
- La puntuacion de una calificacion debe estar entre `1` y `5`.
- Los estados de solicitud permitidos son `pendiente`, `aceptado`, `en_curso`, `completado` y `cancelado`.
- Los estados de pago permitidos son `pendiente`, `pagado` y `reembolsado`.
- Una solicitud debe usar una direccion del cliente autenticado.
- Una direccion marcada como principal usa el campo `es_default`.

## Llaves foraneas

| Relacion | Descripcion |
|---|---|
| `direcciones.id_usuario -> usuarios.id_usuario` | Direcciones de un usuario. |
| `detalles_tecnicos.id_usuario -> usuarios.id_usuario` | Datos tecnicos de un tecnico. |
| `servicios.id_categoria -> categorias_servicios.id_categoria` | Servicio asociado a categoria. |
| `solicitud_servicios.id_cliente -> usuarios.id_usuario` | Cliente que solicita. |
| `solicitud_servicios.id_tecnico -> usuarios.id_usuario` | Tecnico asignado. |
| `solicitud_servicios.id_servicio -> servicios.id_servicio` | Servicio solicitado. |
| `solicitud_servicios.id_direccion -> direcciones.id_direccion` | Direccion del servicio. |
| `pagos.id_ss -> solicitud_servicios.id_ss` | Pago de una solicitud. |
| `calificaciones.id_ss -> solicitud_servicios.id_ss` | Calificacion de una solicitud. |
| `comentarios.id_ss -> solicitud_servicios.id_ss` | Comentario de una solicitud. |

## Vista, subconsulta y datos de prueba

El archivo `sql/servicios_tecnicos.sql` contiene la creacion de tablas, datos de prueba, restricciones `CHECK`, una vista y una subconsulta comentada.

- Vista: `vista_resumen_servicios_categoria`.
- Endpoint que usa la vista: `GET /servicios/reportes/resumen-categorias`.
- Subconsulta: servicios activos con precio superior al promedio.
- Endpoint que usa la subconsulta: `GET /servicios/reportes/precio-sobre-promedio`.

## Endpoints

La documentacion interactiva esta disponible en `/api/docs`.

| Metodo | Ruta | Descripcion |
|---|---|---|
| POST | `/auth/register` | Registra usuario. |
| POST | `/auth/login` | Inicia sesion. |
| POST | `/auth/refresh` | Renueva token. |
| POST | `/auth/logout` | Cierra sesion. |
| GET | `/usuarios` | Lista usuarios. |
| GET | `/usuarios/tecnicos` | Lista tecnicos. |
| GET | `/usuarios/:id` | Obtiene usuario. |
| PATCH | `/usuarios/:id` | Actualiza usuario. |
| PATCH | `/usuarios/:id/desactivar` | Desactiva usuario. |
| POST | `/direcciones` | Crea direccion. |
| GET | `/direcciones` | Lista direcciones. |
| PATCH | `/direcciones/:id` | Actualiza direccion. |
| DELETE | `/direcciones/:id` | Elimina direccion. |
| POST | `/servicios` | Crea servicio. |
| GET | `/servicios` | Lista servicios. |
| GET | `/servicios/buscar` | Busca servicios. |
| GET | `/servicios/reportes/resumen-categorias` | Reporte desde vista. |
| GET | `/servicios/reportes/precio-sobre-promedio` | Reporte con subconsulta. |
| POST | `/solicitudes-servicio` | Crea solicitud. |
| GET | `/solicitudes-servicio` | Lista solicitudes. |
| PATCH | `/solicitudes-servicio/:id/estado` | Cambia estado. |
| PATCH | `/solicitudes-servicio/:id/cancelar` | Cancela solicitud. |
| POST | `/pagos` | Crea pago. |
| GET | `/pagos/solicitud/:id_ss` | Pagos por solicitud. |
| GET | `/pagos/cliente/:id_cliente` | Pagos por cliente. |
| POST | `/calificaciones` | Crea calificacion. |
| GET | `/calificaciones/top-tecnicos` | Ranking de tecnicos. |
| POST | `/comentarios` | Crea comentario. |
| GET | `/comentarios/solicitud/:id_ss` | Comentarios por solicitud. |
