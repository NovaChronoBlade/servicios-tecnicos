import { Module } from '@nestjs/common';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}
