import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export const PAGOS_ESTADOS = ['pendiente', 'pagado', 'reembolsado'] as const;

export class UpdatePagoEstadoDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(PAGOS_ESTADOS as unknown as string[])
  estado!: string;
}
