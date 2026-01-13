import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === 'P2002') {
      return response.status(409).json({
        statusCode: 409,
        message: 'Email already exists',
      });
    }

    if (exception.code === 'P2025') {
      return response.status(409).json({
        statusCode: 404,
        message: 'no account found',
      });
    }

    response.status(500).json({
      statusCode: 500,
      message: 'Database error',
    });
  }
}
