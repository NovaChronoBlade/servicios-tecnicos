import { Controller } from '@nestjs/common';
import { CalificacionesService } from './calificaciones.service';

@Controller('calificaciones')
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}
}
