import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";
import type { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  public catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const path = request.url;
    const method = request.method;

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    let message = "Internal server error";
    let code: string | undefined = undefined;
    let details: unknown = null;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "object") {
        const res = exceptionResponse as {
          message?: string;
          error: { message?: string; code?: string; details?: any };
        };

        message = res?.error?.message ?? res?.message ?? message;
        code = res?.error?.code ?? code;
        details = res?.error?.details ?? null;
      } else {
        message = exceptionResponse;
      }
    }

    if (Number(statusCode) >= 500) {
      this.logger.error(`${method} ${path} → ${message}`, exception instanceof Error ? exception.stack : undefined);
    } else {
      this.logger.warn(`${method} ${path} → ${message}`);
    }

    response.status(statusCode).json({
      timestamp: new Date().toISOString(),
      statusCode,
      path,
      method,
      error: {
        message,
        code,
        details,
      },
    });
  }
}
