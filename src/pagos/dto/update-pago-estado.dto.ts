import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export const PAGOS_ESTADOS = ['pendiente', 'pagado', 'reembolsado'] as const;

export class UpdatePagoEstadoDto {
  @ApiProperty({ enum: PAGOS_ESTADOS, example: 'pagado' })
  @IsString()
  @IsNotEmpty()
  @IsIn(PAGOS_ESTADOS as unknown as string[])
  estado!: string;
}
