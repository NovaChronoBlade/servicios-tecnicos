import {
  ConflictException,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { status, message } = this.resolveError(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }

  private resolveError(exception: unknown) {
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      return {
        status: exception.getStatus(),
        message: typeof body === 'string' ? body : (body as any).message,
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        const target = Array.isArray(exception.meta?.target)
          ? exception.meta?.target.join(', ')
          : 'registro';

        return {
          status: HttpStatus.CONFLICT,
          message: `Ya existe un registro con el mismo valor para: ${target}`,
        };
      }

      if (exception.code === 'P2025') {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Registro no encontrado',
        };
      }

      if (exception.code === 'P2003') {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'La referencia enviada no existe o no puede eliminarse',
        };
      }

      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Error de base de datos',
      };
    }

    if (exception instanceof ConflictException) {
      return {
        status: exception.getStatus(),
        message: exception.message,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
    };
  }
}
