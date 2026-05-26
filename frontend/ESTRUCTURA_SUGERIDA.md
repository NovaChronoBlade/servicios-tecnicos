# Estructura sugerida para el frontend

Esta guía propone una estructura simple y escalable para el frontend del proyecto usando Next.js con App Router.

## Objetivo

Organizar el código por responsabilidad para que sea más fácil:

- crecer sin mezclar UI, lógica y acceso a datos
- reutilizar componentes y utilidades
- mantener una estructura clara para el equipo

## Estructura propuesta

```text
frontend/
  app/
    layout.tsx
    page.tsx
    globals.css
    (rutas)/
      servicios/
      usuarios/
      pagos/
  components/
    ui/
    layout/
    forms/
  features/
    auth/
    servicios/
    usuarios/
    pagos/
    solicitudes/
  lib/
    api/
    helpers/
    validations/
    constants/
  hooks/
  types/
  styles/
  public/
  tests/
```

## Qué va en cada carpeta

### `app/`

Contiene las rutas de Next.js, layouts, páginas y archivos globales.

- `layout.tsx`: estructura base de toda la app
- `page.tsx`: página principal
- `globals.css`: estilos globales
- `(rutas)/`: rutas agrupadas por dominio o sección

### `components/`

Componentes reutilizables y sin lógica de negocio.

- `ui/`: botones, inputs, cards, modales, badges
- `layout/`: navbar, sidebar, footer, shell
- `forms/`: campos compuestos y partes de formularios

### `features/`

Lógica por dominio funcional.

Cada carpeta debería incluir lo necesario para una entidad o flujo concreto.

- `auth/`: login, registro, sesión
- `servicios/`: catálogo y gestión de servicios
- `usuarios/`: perfil y administración de usuarios
- `pagos/`: pagos, estados y comprobantes
- `solicitudes/`: creación y seguimiento de solicitudes

### `lib/`

Código compartido de soporte.

- `api/`: cliente HTTP, fetchers, interceptores
- `helpers/`: funciones auxiliares
- `validations/`: esquemas y validaciones
- `constants/`: constantes de negocio o UI

### `hooks/`

Hooks personalizados reutilizables.

### `types/`

Tipos globales o compartidos entre módulos.

### `styles/`

Estilos adicionales si el proyecto los necesita.

### `public/`

Archivos estáticos como imágenes, iconos y fuentes.

### `tests/`

Pruebas del frontend, si se decide separarlas fuera de `app/` o junto al módulo correspondiente.

## Reglas prácticas

1. Si un componente se reutiliza en más de una pantalla, debe vivir en `components/`.
2. Si algo pertenece a un flujo de negocio específico, debe vivir en `features/`.
3. Si una función se usa en varios módulos y no depende de UI, debe vivir en `lib/`.
4. Mantener `app/` lo más delgado posible: rutas, layouts y composición.
5. Evitar carpetas genéricas como `utils/` si el contenido puede organizarse mejor por dominio.

## Sugerencia para este proyecto

Como el backend ya está dividido por dominios, el frontend puede seguir la misma lógica:

- `servicios`
- `usuarios`
- `pagos`
- `direcciones`
- `solicitudes`
- `calificaciones`

Eso ayuda a que la navegación, los componentes y la lógica coincidan con la estructura del API.

## Convención de nombres

- Carpetas en minúsculas y plural cuando represente una colección o dominio.
- Componentes en PascalCase.
- Archivos de páginas y rutas según la convención de Next.js.
- Componentes reutilizables con nombres descriptivos y cortos.

## Flujo recomendado

Cuando se agregue una nueva funcionalidad:

1. Crear la ruta en `app/` si expone una pantalla.
2. Crear la lógica de negocio en `features/<dominio>/`.
3. Reutilizar componentes comunes desde `components/`.
4. Centralizar validaciones y helpers compartidos en `lib/`.

## Nota

Esta es una propuesta inicial. La estructura puede ajustarse según crezca el frontend o cambien las prioridades del proyecto.