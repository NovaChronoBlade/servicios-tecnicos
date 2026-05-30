import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolEnum } from 'src/auth/enums/rol.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Administracion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolEnum.ADMIN)
@Controller('admin')
export class AdminController {
  @Get('configuracion')
  @ApiOperation({ summary: 'Resumen de configuracion administrativa' })
  @ApiResponse({ status: 200, description: 'Configuracion encontrada' })
  getConfiguracion() {
    return {
      cors: 'Configurable por CORS_ORIGINS',
      auth: 'JWT con access token, refresh token y logout',
      logs: 'Pino configurado por LOG_LEVEL',
      cobertura: 'Umbral global minimo del 70%',
      fuente: 'Configuracion informativa del backend',
    };
  }

  @Get('auditoria')
  @ApiOperation({ summary: 'Eventos administrativos informativos' })
  @ApiResponse({ status: 200, description: 'Eventos encontrados' })
  getAuditoria() {
    return [
      {
        id: 'audit-config',
        modulo: 'Sistema',
        evento: 'Configuracion administrativa disponible',
        fecha: new Date().toISOString(),
      },
      {
        id: 'audit-comments',
        modulo: 'Comentarios',
        evento: 'Modulo de comentarios expuesto para administracion',
        fecha: new Date().toISOString(),
      },
    ];
  }
}
