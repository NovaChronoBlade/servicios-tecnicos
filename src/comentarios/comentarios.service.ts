import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@Injectable()
export class ComentariosService {
  constructor(private prisma: PrismaService) {}

  async create(createComentarioDto: CreateComentarioDto) {
    const { id_tecnico, id_cliente, id_ss, contenido } = createComentarioDto;

    const solicitudes = await this.prisma.$queryRaw`
      SELECT id_ss, id_cliente, id_tecnico
      FROM solicitud_servicios
      WHERE id_ss = ${id_ss}
      LIMIT 1
    `;
    const solicitud = Array.isArray(solicitudes) ? solicitudes[0] : null;
    if (!solicitud) {
      throw new NotFoundException(`Solicitud '${id_ss}' no encontrada`);
    }

    if (
      solicitud.id_cliente !== id_cliente ||
      solicitud.id_tecnico !== id_tecnico
    ) {
      throw new BadRequestException(
        'El comentario debe coincidir con el cliente y tecnico de la solicitud',
      );
    }

    const id_comentario = this.generarIdComentario();

    await this.prisma.$executeRaw`
      INSERT INTO comentarios (id_comentario, id_tecnico, id_cliente, id_ss, contenido)
      VALUES (${id_comentario}, ${id_tecnico}, ${id_cliente}, ${id_ss}, ${contenido})
    `;

    return {
      id_comentario,
      id_tecnico,
      id_cliente,
      id_ss,
      contenido,
    };
  }

  async findAll() {
    return this.prisma.$queryRaw`
      SELECT
        c.id_comentario,
        c.id_ss,
        c.contenido,
        c.fecha_comentario,
        c.id_cliente,
        u_cli.nombre AS nombre_cliente,
        c.id_tecnico,
        u_tec.nombre AS nombre_tecnico
      FROM comentarios c
      JOIN usuarios u_cli ON u_cli.id_usuario = c.id_cliente
      JOIN usuarios u_tec ON u_tec.id_usuario = c.id_tecnico
      ORDER BY c.fecha_comentario DESC
    `;
  }

  async findBySolicitud(id_ss: string) {
    return this.prisma.$queryRaw`
      SELECT
        c.id_comentario,
        c.id_ss,
        c.contenido,
        c.fecha_comentario,
        c.id_cliente,
        u_cli.nombre AS nombre_cliente,
        c.id_tecnico,
        u_tec.nombre AS nombre_tecnico
      FROM comentarios c
      JOIN usuarios u_cli ON u_cli.id_usuario = c.id_cliente
      JOIN usuarios u_tec ON u_tec.id_usuario = c.id_tecnico
      WHERE c.id_ss = ${id_ss}
      ORDER BY c.fecha_comentario DESC
    `;
  }

  async findOne(id_comentario: string) {
    const comentarios = await this.prisma.$queryRaw`
      SELECT
        c.id_comentario,
        c.id_ss,
        c.contenido,
        c.fecha_comentario,
        c.id_cliente,
        u_cli.nombre AS nombre_cliente,
        c.id_tecnico,
        u_tec.nombre AS nombre_tecnico
      FROM comentarios c
      JOIN usuarios u_cli ON u_cli.id_usuario = c.id_cliente
      JOIN usuarios u_tec ON u_tec.id_usuario = c.id_tecnico
      WHERE c.id_comentario = ${id_comentario}
      LIMIT 1
    `;

    const comentario = Array.isArray(comentarios) ? comentarios[0] : null;
    if (!comentario) {
      throw new NotFoundException(
        `Comentario '${id_comentario}' no encontrado`,
      );
    }

    return comentario;
  }

  async update(
    id_comentario: string,
    updateComentarioDto: UpdateComentarioDto,
  ) {
    await this.findOne(id_comentario);

    if (!updateComentarioDto.contenido) {
      throw new BadRequestException('Debe enviar contenido para actualizar');
    }

    await this.prisma.$executeRaw`
      UPDATE comentarios
      SET contenido = ${updateComentarioDto.contenido}
      WHERE id_comentario = ${id_comentario}
    `;

    return this.findOne(id_comentario);
  }

  async remove(id_comentario: string) {
    await this.findOne(id_comentario);

    await this.prisma.$executeRaw`
      DELETE FROM comentarios WHERE id_comentario = ${id_comentario}
    `;

    return { message: `Comentario '${id_comentario}' eliminado exitosamente` };
  }

  private generarIdComentario(): string {
    const shortId = uuidv4().split('-')[0].toUpperCase();
    return `COM-${shortId}`;
  }
}
