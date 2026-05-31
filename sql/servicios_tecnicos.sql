-- Proyecto: Plataforma de Servicios a Domicilio
-- Script SQL de creacion, restricciones, vista, subconsulta y datos de prueba.

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario VARCHAR(50) PRIMARY KEY,
  documento VARCHAR(20) UNIQUE NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) UNIQUE NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('cliente', 'tecnico', 'admin')),
  activo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS detalles_tecnicos (
  id_usuario VARCHAR(50) PRIMARY KEY,
  especialidad VARCHAR(100) NOT NULL,
  licencia_profesional VARCHAR(50) NOT NULL,
  disponible BOOLEAN NOT NULL DEFAULT true,
  calificacion_promedio DECIMAL(3, 2) NOT NULL DEFAULT 0.0 CHECK (calificacion_promedio BETWEEN 0 AND 5),
  CONSTRAINT fk_detalles_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS direcciones (
  id_direccion VARCHAR(50) PRIMARY KEY,
  id_usuario VARCHAR(50) NOT NULL,
  direccion VARCHAR(200) NOT NULL,
  tipo_edificio VARCHAR(50) NOT NULL,
  informacion VARCHAR(200),
  nota VARCHAR(200),
  es_default BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT fk_direcciones_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS categorias_servicios (
  id_categoria VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion VARCHAR(500),
  activo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS servicios (
  id_servicio VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0.01),
  activo BOOLEAN NOT NULL DEFAULT true,
  id_categoria VARCHAR(50),
  CONSTRAINT fk_servicios_categoria FOREIGN KEY (id_categoria) REFERENCES categorias_servicios(id_categoria) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS solicitud_servicios (
  id_ss VARCHAR(50) PRIMARY KEY,
  id_cliente VARCHAR(50) NOT NULL,
  id_tecnico VARCHAR(50),
  id_servicio VARCHAR(50) NOT NULL,
  id_direccion VARCHAR(50) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'asignado', 'aceptado', 'en_curso', 'completado', 'cancelado')),
  confirmacion_cliente BOOLEAN NOT NULL DEFAULT false,
  confirmacion_tecnico BOOLEAN NOT NULL DEFAULT false,
  motivo_cancelacion VARCHAR(500),
  fecha TIMESTAMP NOT NULL DEFAULT now(),
  fecha_programada TIMESTAMP,
  fecha_aceptacion TIMESTAMP,
  fecha_finalizacion TIMESTAMP,
  CONSTRAINT fk_ss_cliente FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE,
  CONSTRAINT fk_ss_tecnico FOREIGN KEY (id_tecnico) REFERENCES usuarios(id_usuario) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_ss_servicio FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON UPDATE CASCADE,
  CONSTRAINT fk_ss_direccion FOREIGN KEY (id_direccion) REFERENCES direcciones(id_direccion) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS pagos (
  id_pago VARCHAR(50) PRIMARY KEY,
  id_ss VARCHAR(50) UNIQUE NOT NULL,
  monto DECIMAL(10, 2) NOT NULL CHECK (monto >= 0.01),
  metodo_pago VARCHAR(50) NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'pagado', 'reembolsado')),
  numero_referencia VARCHAR(50) UNIQUE,
  fecha_pago TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT fk_pagos_ss FOREIGN KEY (id_ss) REFERENCES solicitud_servicios(id_ss) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS calificaciones (
  id_calificacion VARCHAR(50) PRIMARY KEY,
  id_tecnico VARCHAR(50) NOT NULL,
  id_cliente VARCHAR(50) NOT NULL,
  id_ss VARCHAR(50) NOT NULL,
  puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
  comentario VARCHAR(500),
  fecha_calificacion TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT fk_cal_tecnico FOREIGN KEY (id_tecnico) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE,
  CONSTRAINT fk_cal_cliente FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE,
  CONSTRAINT fk_cal_ss FOREIGN KEY (id_ss) REFERENCES solicitud_servicios(id_ss) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS comentarios (
  id_comentario VARCHAR(50) PRIMARY KEY,
  id_tecnico VARCHAR(50) NOT NULL,
  id_cliente VARCHAR(50) NOT NULL,
  id_ss VARCHAR(50) NOT NULL,
  contenido VARCHAR(500) NOT NULL,
  fecha_comentario TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT fk_com_tecnico FOREIGN KEY (id_tecnico) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE,
  CONSTRAINT fk_com_cliente FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE,
  CONSTRAINT fk_com_ss FOREIGN KEY (id_ss) REFERENCES solicitud_servicios(id_ss) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id_refresh VARCHAR(50) PRIMARY KEY,
  id_usuario VARCHAR(50) NOT NULL,
  token_hash VARCHAR(64) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT fk_refresh_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS revoked_access_tokens (
  id_jti VARCHAR(50) PRIMARY KEY,
  id_usuario VARCHAR(50) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT fk_revoked_access_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
);

-- VISTA: resume por categoria cuantos servicios existen, cuantos estan activos y sus precios.
-- Sirve para reportes administrativos sin recalcular la agregacion desde el backend.
-- Endpoint que la usa: GET /servicios/reportes/resumen-categorias.
CREATE OR REPLACE VIEW vista_resumen_servicios_categoria AS
SELECT
  c.id_categoria,
  c.nombre AS nombre_categoria,
  COUNT(s.id_servicio)::int AS total_servicios,
  COUNT(*) FILTER (WHERE s.activo = true)::int AS servicios_activos,
  COALESCE(ROUND(AVG(s.precio), 2), 0)::numeric(10, 2) AS precio_promedio,
  COALESCE(MIN(s.precio), 0)::numeric(10, 2) AS precio_minimo,
  COALESCE(MAX(s.precio), 0)::numeric(10, 2) AS precio_maximo
FROM categorias_servicios c
LEFT JOIN servicios s ON s.id_categoria = c.id_categoria
GROUP BY c.id_categoria, c.nombre;

INSERT INTO usuarios (id_usuario, documento, fecha_nacimiento, nombre, correo, contrasena, telefono, rol, activo) VALUES
('USR-ADMIN', '1000000001', '1990-01-10', 'Administrador General', 'admin@servicios.com', 'hash-demo', '3000000001', 'admin', true),
('USR-CLIENTE', '1000000002', '1998-05-20', 'Cliente Demo', 'cliente@servicios.com', 'hash-demo', '3000000002', 'cliente', true),
('USR-TECNICO', '1000000003', '1988-09-15', 'Tecnico Demo', 'tecnico@servicios.com', 'hash-demo', '3000000003', 'tecnico', true)
ON CONFLICT (id_usuario) DO NOTHING;

INSERT INTO detalles_tecnicos (id_usuario, especialidad, licencia_profesional, disponible, calificacion_promedio) VALUES
('USR-TECNICO', 'Electricidad residencial', 'LIC-EL-001', true, 4.8)
ON CONFLICT (id_usuario) DO NOTHING;

INSERT INTO direcciones (id_direccion, id_usuario, direccion, tipo_edificio, informacion, nota, es_default) VALUES
('DIR-001', 'USR-CLIENTE', 'Calle 10 # 20-30', 'Apartamento', 'Torre 2 apto 301', 'Porteria 24 horas', true)
ON CONFLICT (id_direccion) DO NOTHING;

INSERT INTO categorias_servicios (id_categoria, nombre, descripcion, activo) VALUES
('CAT-ELEC', 'Electricidad', 'Servicios electricos para hogares y oficinas', true),
('CAT-PLOM', 'Plomeria', 'Reparaciones hidraulicas y sanitarias', true)
ON CONFLICT (id_categoria) DO NOTHING;

INSERT INTO servicios (id_servicio, nombre, descripcion, precio, activo, id_categoria) VALUES
('SRV-001', 'Instalacion de tomacorriente', 'Instalacion basica de punto electrico', 85000.00, true, 'CAT-ELEC'),
('SRV-002', 'Reparacion de fuga', 'Revision y reparacion de fuga sencilla', 120000.00, true, 'CAT-PLOM')
ON CONFLICT (id_servicio) DO NOTHING;

INSERT INTO solicitud_servicios (id_ss, id_cliente, id_tecnico, id_servicio, id_direccion, estado, confirmacion_cliente, confirmacion_tecnico, fecha_programada) VALUES
('SS-001', 'USR-CLIENTE', 'USR-TECNICO', 'SRV-001', 'DIR-001', 'completado', true, true, '2026-06-10 09:00:00')
ON CONFLICT (id_ss) DO NOTHING;

INSERT INTO pagos (id_pago, id_ss, monto, metodo_pago, estado, numero_referencia) VALUES
('PAG-001', 'SS-001', 85000.00, 'tarjeta', 'pagado', 'REF-001')
ON CONFLICT (id_pago) DO NOTHING;

INSERT INTO calificaciones (id_calificacion, id_tecnico, id_cliente, id_ss, puntuacion, comentario) VALUES
('CAL-001', 'USR-TECNICO', 'USR-CLIENTE', 'SS-001', 5, 'Servicio cumplido y puntual')
ON CONFLICT (id_calificacion) DO NOTHING;

INSERT INTO comentarios (id_comentario, id_tecnico, id_cliente, id_ss, contenido) VALUES
('COM-001', 'USR-TECNICO', 'USR-CLIENTE', 'SS-001', 'Buen trabajo en la instalacion')
ON CONFLICT (id_comentario) DO NOTHING;

-- SUBCONSULTA: muestra servicios activos cuyo precio supera el promedio de servicios activos.
-- Endpoint que usa esta misma idea: GET /servicios/reportes/precio-sobre-promedio.
SELECT
  s.id_servicio,
  s.nombre,
  s.precio
FROM servicios s
WHERE s.precio > (
  SELECT AVG(precio)
  FROM servicios
  WHERE activo = true
)
  AND s.activo = true
ORDER BY s.precio DESC;
