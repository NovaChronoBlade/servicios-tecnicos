-- CreateTable
CREATE TABLE "calificaciones" (
    "id_calificacion" VARCHAR(50) NOT NULL,
    "id_tecnico" VARCHAR(50) NOT NULL,
    "id_cliente" VARCHAR(50) NOT NULL,
    "id_ss" VARCHAR(50) NOT NULL,
    "puntuacion" INTEGER NOT NULL,
    "comentario" VARCHAR(500),
    "fecha_calificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificaciones_pkey" PRIMARY KEY ("id_calificacion")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "id_comentario" VARCHAR(50) NOT NULL,
    "id_tecnico" VARCHAR(50) NOT NULL,
    "id_cliente" VARCHAR(50) NOT NULL,
    "id_ss" VARCHAR(50) NOT NULL,
    "contenido" VARCHAR(500) NOT NULL,
    "fecha_comentario" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id_comentario")
);

-- CreateTable
CREATE TABLE "detalles_tecnicos" (
    "id_usuario" VARCHAR(50) NOT NULL,
    "especialidad" VARCHAR(100) NOT NULL,
    "licencia_profesional" VARCHAR(50) NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "calificacion_promedio" DECIMAL(3,2) NOT NULL DEFAULT 0.0,

    CONSTRAINT "detalles_tecnicos_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id_direccion" VARCHAR(50) NOT NULL,
    "id_usuario" VARCHAR(50) NOT NULL,
    "direccion" VARCHAR(200) NOT NULL,
    "tipo_edificio" VARCHAR(50) NOT NULL,
    "informacion" VARCHAR(200),
    "nota" VARCHAR(200),

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id_direccion")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id_pago" VARCHAR(50) NOT NULL,
    "id_ss" VARCHAR(50) NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodo_pago" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(20) NOT NULL,
    "fecha_pago" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id_servicio" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(500) NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id_servicio")
);

-- CreateTable
CREATE TABLE "solicitud_servicios" (
    "id_ss" VARCHAR(50) NOT NULL,
    "id_cliente" VARCHAR(50) NOT NULL,
    "id_tecnico" VARCHAR(50),
    "id_servicio" VARCHAR(50) NOT NULL,
    "id_direccion" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "confirmacion_cliente" BOOLEAN NOT NULL DEFAULT false,
    "confirmacion_tecnico" BOOLEAN NOT NULL DEFAULT false,
    "fecha" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitud_servicios_pkey" PRIMARY KEY ("id_ss")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" VARCHAR(50) NOT NULL,
    "documento" VARCHAR(20) NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "rol" VARCHAR(20) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "pagos_id_ss_key" ON "pagos"("id_ss");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_documento_key" ON "usuarios"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_telefono_key" ON "usuarios"("telefono");

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "fk_cal_cliente" FOREIGN KEY ("id_cliente") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "fk_cal_ss" FOREIGN KEY ("id_ss") REFERENCES "solicitud_servicios"("id_ss") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "fk_cal_tecnico" FOREIGN KEY ("id_tecnico") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "fk_com_cliente" FOREIGN KEY ("id_cliente") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "fk_com_ss" FOREIGN KEY ("id_ss") REFERENCES "solicitud_servicios"("id_ss") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "fk_com_tecnico" FOREIGN KEY ("id_tecnico") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_tecnicos" ADD CONSTRAINT "fk_detalles_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "fk_direcciones_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "fk_pagos_ss" FOREIGN KEY ("id_ss") REFERENCES "solicitud_servicios"("id_ss") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_servicios" ADD CONSTRAINT "fk_ss_cliente" FOREIGN KEY ("id_cliente") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_servicios" ADD CONSTRAINT "fk_ss_direccion" FOREIGN KEY ("id_direccion") REFERENCES "direcciones"("id_direccion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_servicios" ADD CONSTRAINT "fk_ss_servicio" FOREIGN KEY ("id_servicio") REFERENCES "servicios"("id_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_servicios" ADD CONSTRAINT "fk_ss_tecnico" FOREIGN KEY ("id_tecnico") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
