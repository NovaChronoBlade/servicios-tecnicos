import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Estado')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Verifica que la API este disponible.
   * Parametros: ninguno.
   * Respuesta: mensaje simple de estado.
   */
  @Get()
  @ApiOperation({ summary: 'Health check basico' })
  @ApiResponse({ status: 200, description: 'API disponible' })
  getHello(): string {
    return this.appService.getHello();
  }
}
