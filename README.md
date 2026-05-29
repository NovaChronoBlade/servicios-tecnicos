# Servicios Tecnicos

API REST construida con NestJS, Prisma y PostgreSQL para administrar una plataforma de servicios tecnicos a domicilio. El sistema permite registrar usuarios, gestionar direcciones, publicar servicios, crear solicitudes, asignar tecnicos, registrar pagos, calificar y comentar servicios realizados.

## Integrantes

- Andres Felipe Ruiz Vasallo
- Juan Camilo Mosquera Palomino
- Pablo Garzon Gomez
- Kevin David Rincon Valencia
- Andres David Murillo Castro

## Modulos

- **Auth**: registro, login, refresh token, logout e invalidacion de tokens.
- **Usuarios**: perfiles, tecnicos, filtros, actualizacion y desactivacion.
- **Direcciones**: CRUD de direcciones y direccion principal con `es_default`.
- **Servicios**: servicios, categorias, busqueda, paginacion y reportes SQL.
- **Solicitudes de servicio**: creacion, asignacion, reasignacion, estados y cancelacion.
- **Pagos**: pagos, historial, referencias y reembolsos.
- **Calificaciones y comentarios**: calificaciones por solicitud, ranking y comentarios.

## Requerimientos funcionales

- El usuario puede registrarse, iniciar sesion, renovar token y cerrar sesion.
- El cliente puede administrar sus direcciones y marcar una como principal.
- El cliente puede crear solicitudes de servicio usando una direccion propia.
- El tecnico puede consultar solicitudes disponibles y aceptar servicios.
- El administrador puede gestionar usuarios, servicios, pagos y reasignaciones.
- El cliente puede pagar, calificar y comentar una solicitud atendida.

## Requisitos previos

- Node.js 22 o compatible.
- npm para instalar dependencias y ejecutar scripts.
- PostgreSQL para la base de datos.
- VS Code, IntelliJ IDEA, WebStorm o un editor compatible.
- Git para clonar el repositorio y trabajar con ramas.

## Diagrama ER

![Diagrama ER](docs/Diagrama_ER.png)

## Base de datos y SQL

Prisma administra las migraciones en `prisma/migrations`. Ademas, el proyecto incluye el script SQL final en:

```text
sql/servicios_tecnicos.sql
```

Ese script contiene:

- Creacion de tablas principales.
- Datos de prueba.
- Restricciones `CHECK`.
- Vista `vista_resumen_servicios_categoria`.
- Comentarios SQL que explican la vista y la subconsulta.
- Subconsulta para obtener servicios activos con precio mayor al promedio.

La migracion `20260529100000_vista_restricciones_y_subconsulta` agrega restricciones `CHECK` reales y la vista usada desde el backend.

## Variables de entorno

Crea un archivo `.env` en la raiz del backend:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/servicioTecnico?schema=public"
JWT_SECRET="cambia-este-secreto"
JWT_ACCESS_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN_DAYS=7
CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002"
PORT=3000
LOG_LEVEL="info"
LOGIN_THROTTLE_TTL=60000
LOGIN_THROTTLE_LIMIT=5
PAYMENT_GATEWAY_MODE=mock
PAYMENT_GATEWAY_URL=
PAYMENT_GATEWAY_API_KEY=
PAYMENT_GATEWAY_TIMEOUT_MS=10000
```

## Instalacion y ejecucion

```powershell
git clone https://github.com/NovaChronoBlade/servicios-tecnicos.git
cd servicios-tecnicos
npm.cmd install
npx.cmd prisma migrate deploy
npx.cmd prisma generate
npm.cmd run start:dev
```

La API queda disponible en `http://localhost:3000`.

Swagger/OpenAPI queda disponible en:

```text
http://localhost:3000/api/docs
```

## Endpoints

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| GET | `/` | Mensaje raiz de la API | Publico |
| POST | `/auth/register` | Registra usuario | Publico |
| POST | `/auth/login` | Inicia sesion | Publico |
| POST | `/auth/refresh` | Renueva JWT | Publico |
| POST | `/auth/logout` | Cierra sesion e invalida token | JWT |
| GET | `/usuarios?page=&limit=&rol=&activo=` | Lista usuarios con filtros | Admin |
| GET | `/usuarios/tecnicos` | Lista tecnicos | JWT |
| GET | `/usuarios/:id` | Obtiene usuario | Propio/Admin |
| PATCH | `/usuarios/:id` | Actualiza perfil | Propio/Admin |
| PATCH | `/usuarios/:id/desactivar` | Desactiva usuario | Admin |
| POST | `/usuarios/:id_tecnico/datos-tecnicos` | Crea datos tecnicos | Tecnico/Admin |
| PATCH | `/usuarios/:id/detalles-tecnicos` | Actualiza datos tecnicos | Tecnico/Admin |
| POST | `/direcciones` | Crea direccion | Cliente/Admin |
| GET | `/direcciones` | Lista direcciones | Cliente/Admin |
| GET | `/direcciones/usuario/:id_usuario` | Lista direcciones por usuario | Propio/Admin |
| GET | `/direcciones/:id` | Obtiene direccion | Propio/Admin |
| PATCH | `/direcciones/:id` | Actualiza direccion | Propio/Admin |
| DELETE | `/direcciones/:id` | Elimina direccion | Propio/Admin |
| POST | `/servicios` | Crea servicio | Tecnico/Admin |
| GET | `/servicios?page=&limit=` | Lista servicios | JWT |
| POST | `/servicios/categorias` | Crea categoria | Admin |
| GET | `/servicios/categorias` | Lista categorias | JWT |
| GET | `/servicios/buscar?nombre=&page=&limit=` | Busca servicios por nombre | JWT |
| GET | `/servicios/rango-precio?min=&max=` | Busca por rango de precio | JWT |
| GET | `/servicios/reportes/resumen-categorias` | Reporte desde vista SQL | JWT |
| GET | `/servicios/reportes/precio-sobre-promedio` | Reporte con subconsulta SQL | JWT |
| GET | `/servicios/:id` | Obtiene servicio | JWT |
| PATCH | `/servicios/:id` | Actualiza servicio | Admin |
| DELETE | `/servicios/:id` | Desactiva servicio | Admin |
| PATCH | `/servicios/:id/activar` | Reactiva servicio | Admin |
| POST | `/solicitudes-servicio` | Crea solicitud | Cliente/Admin |
| GET | `/solicitudes-servicio?page=&limit=&estado=&id_tecnico=&desde=` | Lista solicitudes | Admin |
| GET | `/solicitudes-servicio/estado?estado=` | Filtra por estado | Admin |
| GET | `/solicitudes-servicio/cliente/:id_cliente` | Solicitudes del cliente | Cliente/Admin |
| GET | `/solicitudes-servicio/tecnico/:id_tecnico` | Solicitudes del tecnico | Tecnico/Admin |
| GET | `/solicitudes-servicio/pendientes-disponibles` | Pendientes sin tecnico | Tecnico/Admin |
| GET | `/solicitudes-servicio/:id` | Obtiene solicitud | JWT |
| PATCH | `/solicitudes-servicio/:id/estado` | Cambia estado | Tecnico/Admin |
| PATCH | `/solicitudes-servicio/:id/cancelar` | Cancela con motivo | Cliente/Tecnico/Admin |
| PATCH | `/solicitudes-servicio/:id/reasignar-tecnico` | Reasigna tecnico | Admin |
| PATCH | `/solicitudes-servicio/:id/asignar-tecnico/:id_tecnico` | Asigna tecnico | Tecnico/Admin |
| PATCH | `/solicitudes-servicio/:id/confirmar/cliente` | Confirma cliente | Cliente |
| PATCH | `/solicitudes-servicio/:id/confirmar/tecnico` | Confirma tecnico | Tecnico |
| POST | `/pagos` | Crea pago | Cliente/Admin |
| GET | `/pagos/solicitud/:id_ss` | Pagos por solicitud | JWT |
| GET | `/pagos/cliente/:id_cliente` | Historial por cliente | Cliente/Admin |
| GET | `/pagos/:id` | Obtiene pago | JWT |
| PATCH | `/pagos/:id/estado` | Cambia estado | Admin |
| PATCH | `/pagos/:id/reembolsar` | Reembolsa pago | Admin |
| POST | `/comentarios` | Crea comentario | Cliente/Admin |
| GET | `/comentarios` | Lista comentarios | JWT |
| GET | `/comentarios/solicitud/:id_ss` | Comentarios por solicitud | JWT |
| GET | `/comentarios/:id` | Obtiene comentario | JWT |
| PATCH | `/comentarios/:id` | Actualiza comentario | Cliente/Admin |
| DELETE | `/comentarios/:id` | Elimina comentario | Admin |
| POST | `/calificaciones` | Crea calificacion | Cliente/Admin |
| GET | `/calificaciones/top-tecnicos` | Ranking de tecnicos | JWT |
| GET | `/calificaciones/tecnico/:id_tecnico?page=&limit=` | Calificaciones por tecnico | JWT |
| GET | `/calificaciones/tecnico/:id_tecnico/promedio` | Promedio por tecnico | JWT |
| GET | `/calificaciones/cliente/:id_cliente?page=&limit=` | Calificaciones por cliente | JWT |
| GET | `/calificaciones/:id` | Obtiene calificacion | JWT |

## Verificacion

```powershell
npm.cmd run build
npm.cmd test
npm.cmd run test:e2e
npm.cmd run test:cov
```
