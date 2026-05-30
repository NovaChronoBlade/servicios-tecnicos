CREATE TABLE "disponibilidad_tecnicos" (
    "id_disponibilidad" VARCHAR(50) NOT NULL,
    "id_tecnico" VARCHAR(50) NOT NULL,
    "dia_semana" INTEGER NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "nota" VARCHAR(200),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disponibilidad_tecnicos_pkey" PRIMARY KEY ("id_disponibilidad")
);

ALTER TABLE "disponibilidad_tecnicos"
ADD CONSTRAINT "chk_disponibilidad_dia_semana"
CHECK ("dia_semana" BETWEEN 1 AND 7);

ALTER TABLE "disponibilidad_tecnicos"
ADD CONSTRAINT "chk_disponibilidad_horas"
CHECK ("hora_inicio" < "hora_fin");

CREATE UNIQUE INDEX "disponibilidad_tecnicos_bloque_key"
ON "disponibilidad_tecnicos"("id_tecnico", "dia_semana", "hora_inicio", "hora_fin");

ALTER TABLE "disponibilidad_tecnicos"
ADD CONSTRAINT "fk_disponibilidad_tecnico"
FOREIGN KEY ("id_tecnico") REFERENCES "usuarios"("id_usuario")
ON DELETE CASCADE ON UPDATE CASCADE;
