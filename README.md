# Servicios Tecnicos

API REST para gestionar un sistema de servicios tecnicos: registro e inicio de sesion de usuarios, tecnicos, servicios, direcciones, solicitudes de servicio, pagos y calificaciones.

## Modulos

- **Auth**: registro, login, refresh tokens y logout con invalidacion del JWT activo.
- **Usuarios**: perfiles, tecnicos, desactivacion y datos tecnicos.
- **Direcciones**: direcciones por cliente, direccion predeterminada con `es_default`.
- **Servicios**: creacion, consulta, actualizacion y eliminacion de servicios.
- **Solicitudes de servicio**: creacion, asignacion de tecnico, cambios de estado y confirmaciones.
- **Pagos**: creacion y actualizacion de estado de pagos.
- **Calificaciones**: calificaciones por solicitud, tecnico y cliente.

## Requisitos

- Node.js 22 o compatible.
- PostgreSQL accesible desde `DATABASE_URL`.
- npm.

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
```

## Instalacion

En PowerShell usa `npm.cmd` y `npx.cmd` si la politica de ejecucion bloquea los shims `.ps1`.

```powershell
cd "D:\THE PC MASTER RACE\Escritorio\ServiciosTecnicosProyecto\servicios-tecnicos"
npm.cmd install
npx.cmd prisma migrate deploy
npx.cmd prisma generate
```

## Correr el proyecto

```powershell
npm.cmd run start:dev
```

La API queda disponible en `http://localhost:3000`.

La documentacion OpenAPI/Swagger queda disponible en:

```text
http://localhost:3000/api/docs
```

## Scripts utiles

```powershell
npm.cmd run format
npm.cmd run build
npm.cmd test
npm.cmd run test:e2e
npm.cmd run test:cov
```

## Autenticacion

El login devuelve:

- `access_token`: JWT para usar en `Authorization: Bearer <token>`.
- `refresh_token`: token renovable mediante `POST /auth/refresh`.
- `token`: alias de compatibilidad para clientes existentes.

Para cerrar sesion:

```http
POST /auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refresh_token": "opcional"
}
```

## Base de datos

Prisma administra migraciones en `prisma/migrations`. Las migraciones actuales crean el esquema base, agregan `direcciones.es_default` y las tablas de tokens:

- `refresh_tokens`
- `revoked_access_tokens`

Para aplicar cambios en otro entorno:

```powershell
npx.cmd prisma migrate deploy
```

## Calidad

El proyecto usa:

- Swagger/OpenAPI para documentacion interactiva.
- `@nestjs/config` con validacion Joi de variables de entorno.
- `@nestjs/throttler` para limitar intentos de login.
- `nestjs-pino`/Pino para logs JSON.
- Filtro global para errores HTTP y errores conocidos de Prisma.
- Jest con umbral minimo de cobertura.
