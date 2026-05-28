import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  const createHost = () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => ({ url: '/test' }),
      }),
    } as any;

    return { host, status, json };
  };

  const prismaError = (code: string, meta?: Record<string, unknown>) =>
    new Prisma.PrismaClientKnownRequestError('Prisma error', {
      code,
      clientVersion: 'test',
      meta,
    });

  it('formats Nest HttpException responses', () => {
    const filter = new HttpExceptionFilter();
    const { host, status, json } = createHost();

    filter.catch(new NotFoundException('No encontrado'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/test', error: 'No encontrado' }),
    );
  });

  it('maps known Prisma errors to clean client messages', () => {
    const filter = new HttpExceptionFilter();
    const duplicate = createHost();
    const missing = createHost();
    const relation = createHost();
    const generic = createHost();

    filter.catch(prismaError('P2002', { target: ['correo'] }), duplicate.host);
    filter.catch(prismaError('P2025'), missing.host);
    filter.catch(prismaError('P2003'), relation.host);
    filter.catch(prismaError('P2010'), generic.host);

    expect(duplicate.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(missing.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(relation.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(generic.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
  });

  it('hides unknown errors behind a generic 500 response', () => {
    const filter = new HttpExceptionFilter();
    const { host, status, json } = createHost();

    filter.catch(new Error('raw db failure'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Error interno del servidor' }),
    );
  });

  it('preserves string HttpException response bodies', () => {
    const filter = new HttpExceptionFilter();
    const { host, json } = createHost();

    filter.catch(new BadRequestException('dato invalido'), host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'dato invalido' }),
    );
  });
});
