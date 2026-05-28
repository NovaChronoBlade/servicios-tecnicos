-- AlterTable
ALTER TABLE "pagos" ADD COLUMN "numero_referencia" VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "pagos_numero_referencia_key" ON "pagos"("numero_referencia");

-- CreateTable
CREATE TABLE "categorias_servicios" (
    "id_categoria" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(500),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categorias_servicios_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_servicios_nombre_key" ON "categorias_servicios"("nombre");

-- AlterTable
ALTER TABLE "servicios" ADD COLUMN "activo" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "servicios" ADD COLUMN "id_categoria" VARCHAR(50);

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "fk_servicios_categoria" FOREIGN KEY ("id_categoria") REFERENCES "categorias_servicios"("id_categoria") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "solicitud_servicios" ADD COLUMN "motivo_cancelacion" VARCHAR(500);
ALTER TABLE "solicitud_servicios" ADD COLUMN "fecha_programada" TIMESTAMP(6);
