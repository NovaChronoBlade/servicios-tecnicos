ALTER TABLE "solicitud_servicios"
ADD COLUMN IF NOT EXISTS "fecha_aceptacion" TIMESTAMP(6),
ADD COLUMN IF NOT EXISTS "fecha_finalizacion" TIMESTAMP(6);

ALTER TABLE "solicitud_servicios"
DROP CONSTRAINT IF EXISTS "chk_solicitud_servicios_estado";

ALTER TABLE "solicitud_servicios"
ADD CONSTRAINT "chk_solicitud_servicios_estado"
CHECK ("estado" IN ('pendiente', 'asignado', 'aceptado', 'en_curso', 'completado', 'cancelado'));

UPDATE "solicitud_servicios"
SET "fecha_aceptacion" = COALESCE("fecha_aceptacion", "fecha")
WHERE "id_tecnico" IS NOT NULL
  AND "estado" IN ('aceptado', 'en_curso', 'completado');

UPDATE "solicitud_servicios"
SET "fecha_finalizacion" = COALESCE("fecha_finalizacion", "fecha")
WHERE "estado" = 'completado';
