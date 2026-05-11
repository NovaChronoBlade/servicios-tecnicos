# 🚀 Guía de Colaboración — NestJS + Prisma + Git

> Guía para que el equipo pueda clonar, configurar y colaborar en el proyecto correctamente.

---

## 1. Clonar el repositorio (primera vez)

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

---

## 2. Instalar dependencias

```bash
npm install
```

> Nunca subas la carpeta `node_modules` al repo. Cada quien la genera con este comando.

---

## 3. Configurar el archivo `.env`

El archivo `.env` **no se sube al repositorio** (está en `.gitignore`). Cada integrante debe crearlo manualmente en la raíz del proyecto.

Crea el archivo `.env` y pega esto:

```dotenv
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/nombre_db?schema=public"
```

> Pídele al líder del equipo el valor correcto de `DATABASE_URL`.  
> Cada quien puede tener su propia base de datos local, solo asegúrense de usar el mismo nombre.

---

## 4. Generar el cliente de Prisma

Después de instalar dependencias, **siempre** correr:

```bash
npx prisma generate
```

Esto genera los tipos de Prisma a partir del `schema.prisma` que viene en el repo.

---

## 5. Sincronizar la base de datos local

### Opción A — Si el proyecto usa migraciones (recomendado en equipos)

```bash
npx prisma migrate dev
```

Aplica todas las migraciones pendientes a tu base de datos local.

### Opción B — Si no hay migraciones y usan `db push`

```bash
npx prisma db push
```

Sincroniza el `schema.prisma` directo a tu base de datos sin crear archivos de migración.

---

## 6. Levantar el proyecto

```bash
npm run start:dev
```

Si todo está bien verás algo así:

```
[NestApplication] Nest application successfully started
```

---

## 7. Flujo diario para colaborar con Git

### Antes de empezar a trabajar

```bash
# Asegúrate de estar en la rama principal
git checkout main

# Traer los últimos cambios del equipo
git pull origin main
```

### Crear tu rama para trabajar

```bash
# Crea una rama con tu nombre o la feature que vas a hacer
git checkout -b feature/nombre-de-lo-que-haces

# Ejemplos:
git checkout -b feature/modulo-productos
git checkout -b fix/error-login
git checkout -b feature/juan-usuarios
```

### Guardar y subir tu trabajo

```bash
# Ver qué archivos cambiaste
git status

# Agregar tus cambios
git add .

# Hacer commit con un mensaje claro
git commit -m "feat: agrega módulo de productos con CRUD"

# Subir tu rama al repositorio
git push origin feature/nombre-de-lo-que-haces
```

Luego abre un **Pull Request** en GitHub para que el equipo revise antes de hacer merge a `main`.

---

## 8. Cuando un compañero cambia el schema de Prisma

Si alguien modificó `prisma/schema.prisma` y lo subió, después de hacer `git pull` debes correr:

```bash
# 1. Traer los cambios
git pull origin main

# 2. Regenerar el cliente de Prisma
npx prisma generate

# 3. Aplicar cambios a tu base de datos local
npx prisma migrate dev
# o si usan db push:
npx prisma db push
```

> ⚠️ Si no corres `prisma generate` después de un pull que trae cambios al schema, tendrás errores de tipos en TypeScript.

---

## 9. Generar un nuevo módulo

```bash
nest g resource nombre-modulo
```

Selecciona:
- `REST API`
- `Yes` para generar CRUD

Luego conecta Prisma en el servicio generado:

```typescript
// nombre-modulo.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NombreModuloService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.nombreModelo.findMany();
  }

  findOne(id: number) {
    return this.prisma.nombreModelo.findUnique({ where: { id } });
  }

  create(data: any) {
    return this.prisma.nombreModelo.create({ data });
  }

  update(id: number, data: any) {
    return this.prisma.nombreModelo.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.nombreModelo.delete({ where: { id } });
  }
}
```

---

## 10. Comandos de referencia rápida

| Acción | Comando |
|---|---|
| Clonar repo | `git clone <url>` |
| Instalar dependencias | `npm install` |
| Generar cliente Prisma | `npx prisma generate` |
| Aplicar migraciones | `npx prisma migrate dev` |
| Sincronizar schema (sin migraciones) | `npx prisma db push` |
| Ver BD en el navegador | `npx prisma studio` |
| Levantar el servidor | `npm run start:dev` |
| Traer últimos cambios | `git pull origin main` |
| Crear rama nueva | `git checkout -b feature/nombre` |
| Subir tu rama | `git push origin feature/nombre` |
| Generar módulo NestJS | `nest g resource nombre` |

---

## ⚠️ Reglas del equipo

- **Nunca** trabajes directo en `main`. Siempre crea tu propia rama.
- **Nunca** subas el archivo `.env` al repositorio.
- **Siempre** haz `git pull` antes de empezar a trabajar.
- **Siempre** corre `npx prisma generate` después de un pull que modifique el schema.
- Los mensajes de commit deben ser descriptivos: `feat:`, `fix:`, `chore:`, `refactor:`.

para crear sql crudo 
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuariosService {

  constructor(private prisma: PrismaService) {}

  // SELECT
  async findAll() {
    return this.prisma.$queryRaw`
      SELECT * FROM usuarios
    `;
  }

  // SELECT BY ID
  async findOne(id: string) {
    return this.prisma.$queryRaw`
      SELECT *
      FROM usuarios
      WHERE id_usuario = ${id}
    `;
  }

  // INSERT
  async create(data: any) {
    return this.prisma.$executeRaw`
      INSERT INTO usuarios (
        id_usuario,
        documento,
        fecha_nacimiento,
        nombre,
        correo,
        contrasena,
        telefono,
        rol
      )
      VALUES (
        ${data.id_usuario},
        ${data.documento},
        ${data.fecha_nacimiento},
        ${data.nombre},
        ${data.correo},
        ${data.contrasena},
        ${data.telefono},
        ${data.rol}
      )
    `;
  }

  // UPDATE
  async update(id: string, nombre: string) {
    return this.prisma.$executeRaw`
      UPDATE usuarios
      SET nombre = ${nombre}
      WHERE id_usuario = ${id}
    `;
  }

  // DELETE
  async remove(id: string) {
    return this.prisma.$executeRaw`
      DELETE FROM usuarios
      WHERE id_usuario = ${id}
    `;
  }
}

executeRaw para queries
queryRaw para selects