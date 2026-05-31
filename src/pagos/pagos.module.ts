import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { PaymentGatewayService } from './payment-gateway.service';

@Module({
  controllers: [PagosController],
  providers: [PagosService, PaymentGatewayService],
  exports: [PaymentGatewayService],
})
export class PagosModule {}
