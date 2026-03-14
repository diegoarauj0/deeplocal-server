import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import { env } from "src/env";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
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

    if (env.NODE_ENV === "development") Logger.warn(message, exception);

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
