import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('Flujo completo servicio tecnico (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const unique = Date.now().toString();
  const password = 'Passw0rd!123';

  let idCliente = '';
  let idTecnico = '';
  let idDireccion = '';
  let idServicio = '';
  let idSolicitud = '';
  let idPago = '';

  let tokenCliente = '';
  let tokenTecnico = '';
  let refreshCliente = '';

  const clienteCorreo = `cliente.e2e.${unique}@test.com`;
  const tecnicoCorreo = `tecnico.e2e.${unique}@test.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    prisma = app.get(PrismaService);
  });

  it('debe completar el flujo: login tecnico/cliente, pago y finalizacion', async () => {
    // 1) Registro cliente
    const registerClienteRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        documento: `1${unique}`.slice(0, 10),
        fecha_nacimiento: '1995-05-20',
        nombre: 'Cliente E2E',
        correo: clienteCorreo,
        contrasena: password,
        telefono: `31${unique.slice(-8)}`,
        rol: 'cliente',
        activo: true,
      })
      .expect(201);

    idCliente = registerClienteRes.body?.usuario?.id_usuario;
    expect(idCliente).toBeTruthy();

    // 2) Registro tecnico
    const registerTecnicoRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        documento: `2${unique}`.slice(0, 10),
        fecha_nacimiento: '1990-09-15',
        nombre: 'Tecnico E2E',
        correo: tecnicoCorreo,
        contrasena: password,
        telefono: `32${unique.slice(-8)}`,
        rol: 'tecnico',
        activo: true,
      })
      .expect(201);

    idTecnico = registerTecnicoRes.body?.usuario?.id_usuario;
    expect(idTecnico).toBeTruthy();

    // 3) Datos tecnicos y direccion del cliente (seed SQL puro)
    await prisma.$executeRaw`
      INSERT INTO detalles_tecnicos (id_usuario, especialidad, licencia_profesional, disponible)
      VALUES (${idTecnico}, 'E2E Electricidad', ${`LIC-${unique}`}, true)
      ON CONFLICT (id_usuario) DO NOTHING
    `;

    idDireccion = `DIR-E2E-${unique}`;
    await prisma.$executeRaw`
      INSERT INTO direcciones (id_direccion, id_usuario, direccion, tipo_edificio, informacion, nota)
      VALUES (${idDireccion}, ${idCliente}, 'Calle E2E #123', 'Casa', 'Referencia e2e', 'sin nota')
    `;

    // 4) Login cliente y tecnico
    const loginClienteRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: clienteCorreo, password })
      .expect(201);

    tokenCliente = loginClienteRes.body?.token;
    refreshCliente = loginClienteRes.body?.refresh_token;
    expect(tokenCliente).toBeTruthy();
    expect(refreshCliente).toBeTruthy();

    const loginTecnicoRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: tecnicoCorreo, password })
      .expect(201);

    tokenTecnico = loginTecnicoRes.body?.token;
    expect(tokenTecnico).toBeTruthy();

    // 5) Tecnico crea servicio
    const createServicioRes = await request(app.getHttpServer())
      .post('/servicios')
      .set('Authorization', `Bearer ${tokenTecnico}`)
      .send({
        nombre: `Servicio E2E ${unique}`,
        descripcion: 'Servicio de prueba e2e',
        precio: 89000,
      })
      .expect(201);

    idServicio = createServicioRes.body?.id_servicio;
    expect(idServicio).toBeTruthy();

    // 6) Cliente crea solicitud
    const createSolicitudRes = await request(app.getHttpServer())
      .post('/solicitudes-servicio')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({
        id_cliente: idCliente,
        id_servicio: idServicio,
        id_direccion: idDireccion,
      })
      .expect(201);

    idSolicitud = createSolicitudRes.body?.id_ss;
    expect(idSolicitud).toBeTruthy();
    expect(createSolicitudRes.body?.estado).toBe('pendiente');

    // 7) Tecnico se asigna la solicitud (pendiente -> aceptado)
    const asignarRes = await request(app.getHttpServer())
      .patch(
        `/solicitudes-servicio/${idSolicitud}/asignar-tecnico/${idTecnico}`,
      )
      .set('Authorization', `Bearer ${tokenTecnico}`)
      .expect(200);

    expect(asignarRes.body?.estado).toBe('aceptado');
    expect(asignarRes.body?.id_tecnico).toBe(idTecnico);

    // 8) Tecnico inicia trabajo (aceptado -> en_curso)
    const enCursoRes = await request(app.getHttpServer())
      .patch(`/solicitudes-servicio/${idSolicitud}/estado`)
      .set('Authorization', `Bearer ${tokenTecnico}`)
      .send({ estado: 'en_curso' })
      .expect(200);

    expect(enCursoRes.body?.estado).toBe('en_curso');

    // 9) Cliente realiza pago
    const createPagoRes = await request(app.getHttpServer())
      .post('/pagos')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({
        id_ss: idSolicitud,
        monto: 89000,
        metodo_pago: 'tarjeta',
        token_pago: `tok-e2e-${unique}`,
      })
      .expect(201);

    idPago = createPagoRes.body?.id_pago;
    expect(idPago).toBeTruthy();
    expect(createPagoRes.body?.estado).toBe('pagado');
    expect(createPagoRes.body?.numero_referencia).toBeTruthy();

    // 10) Confirmacion tecnico
    const confirmarTecnicoRes = await request(app.getHttpServer())
      .patch(`/solicitudes-servicio/${idSolicitud}/confirmar/tecnico`)
      .set('Authorization', `Bearer ${tokenTecnico}`)
      .expect(200);

    expect(confirmarTecnicoRes.body?.confirmacion_tecnico).toBe(true);

    // 11) Confirmacion cliente -> completa servicio
    const confirmarClienteRes = await request(app.getHttpServer())
      .patch(`/solicitudes-servicio/${idSolicitud}/confirmar/cliente`)
      .set('Authorization', `Bearer ${tokenCliente}`)
      .expect(200);

    expect(confirmarClienteRes.body?.confirmacion_cliente).toBe(true);
    expect(confirmarClienteRes.body?.estado).toBe('completado');

    // 12) Verificar estado final por GET
    const getSolicitudRes = await request(app.getHttpServer())
      .get(`/solicitudes-servicio/${idSolicitud}`)
      .set('Authorization', `Bearer ${tokenCliente}`)
      .expect(200);

    expect(getSolicitudRes.body?.estado).toBe('completado');
    expect(getSolicitudRes.body?.id_tecnico).toBe(idTecnico);

    // 13) Refresh token y logout
    const refreshRes = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refresh_token: refreshCliente })
      .expect(201);

    expect(refreshRes.body?.access_token).toBeTruthy();
    expect(refreshRes.body?.refresh_token).toBeTruthy();

    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${refreshRes.body.access_token}`)
      .send({ refresh_token: refreshRes.body.refresh_token })
      .expect(201);
  });

  afterAll(async () => {
    // Limpieza para mantener el test repetible
    if (idSolicitud) {
      await prisma.$executeRaw`DELETE FROM pagos WHERE id_ss = ${idSolicitud}`;
      await prisma.$executeRaw`DELETE FROM calificaciones WHERE id_ss = ${idSolicitud}`;
      await prisma.$executeRaw`DELETE FROM comentarios WHERE id_ss = ${idSolicitud}`;
      await prisma.$executeRaw`DELETE FROM solicitud_servicios WHERE id_ss = ${idSolicitud}`;
    }

    if (idServicio) {
      await prisma.$executeRaw`DELETE FROM servicios WHERE id_servicio = ${idServicio}`;
    }

    if (idDireccion) {
      await prisma.$executeRaw`DELETE FROM direcciones WHERE id_direccion = ${idDireccion}`;
    }

    if (idTecnico) {
      await prisma.$executeRaw`DELETE FROM refresh_tokens WHERE id_usuario = ${idTecnico}`;
      await prisma.$executeRaw`DELETE FROM revoked_access_tokens WHERE id_usuario = ${idTecnico}`;
      await prisma.$executeRaw`DELETE FROM detalles_tecnicos WHERE id_usuario = ${idTecnico}`;
      await prisma.$executeRaw`DELETE FROM usuarios WHERE id_usuario = ${idTecnico}`;
    }

    if (idCliente) {
      await prisma.$executeRaw`DELETE FROM refresh_tokens WHERE id_usuario = ${idCliente}`;
      await prisma.$executeRaw`DELETE FROM revoked_access_tokens WHERE id_usuario = ${idCliente}`;
      await prisma.$executeRaw`DELETE FROM usuarios WHERE id_usuario = ${idCliente}`;
    }

    await app.close();
  });
});
