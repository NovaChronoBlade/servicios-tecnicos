-- Restricciones CHECK reales para reforzar reglas de negocio en base de datos.
ALTER TABLE "servicios"
ADD CONSTRAINT "chk_servicios_precio_minimo"
CHECK ("precio" >= 0.01);

ALTER TABLE "calificaciones"
ADD CONSTRAINT "chk_calificaciones_puntuacion"
CHECK ("puntuacion" BETWEEN 1 AND 5);

ALTER TABLE "solicitud_servicios"
ADD CONSTRAINT "chk_solicitud_servicios_estado"
CHECK ("estado" IN ('pendiente', 'aceptado', 'en_curso', 'completado', 'cancelado'));

ALTER TABLE "pagos"
ADD CONSTRAINT "chk_pagos_estado"
CHECK ("estado" IN ('pendiente', 'pagado', 'reembolsado'));

-- VISTA: resume los servicios por categoria para reportes de administracion.
-- La usa el endpoint GET /servicios/reportes/resumen-categorias.
CREATE OR REPLACE VIEW "vista_resumen_servicios_categoria" AS
SELECT
  c.id_categoria,
  c.nombre AS nombre_categoria,
  COUNT(s.id_servicio)::int AS total_servicios,
  COUNT(*) FILTER (WHERE s.activo = true)::int AS servicios_activos,
  COALESCE(ROUND(AVG(s.precio), 2), 0)::numeric(10, 2) AS precio_promedio,
  COALESCE(MIN(s.precio), 0)::numeric(10, 2) AS precio_minimo,
  COALESCE(MAX(s.precio), 0)::numeric(10, 2) AS precio_maximo
FROM "categorias_servicios" c
LEFT JOIN "servicios" s ON s.id_categoria = c.id_categoria
GROUP BY c.id_categoria, c.nombre;
