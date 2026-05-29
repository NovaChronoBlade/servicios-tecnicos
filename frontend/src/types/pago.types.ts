export type PagoEstado = "pendiente" | "pagado" | "reembolsado";

export interface Pago {
  id_pago: string;
  id_ss: string;
  monto: string; // Decimal de Prisma
  metodo_pago: string;
  estado: PagoEstado;
  numero_referencia?: string | null;
  fecha_pago: string;
}

export interface CreatePagoRequest {
  id_ss: string;
  monto: number;
  metodo_pago: string;
  token_pago?: string;
  moneda?: string; // ISO 4217, ej "COP"
}

export interface UpdatePagoEstadoRequest {
  estado: PagoEstado;
}