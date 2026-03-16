import { HttpException, HttpStatus } from "@nestjs/common";

export class BaseException<T = unknown> extends HttpException {
  constructor(
    message: string,
    public readonly details: T,
    public readonly code: string,
    status: keyof typeof HttpStatus,
  ) {
    const statusCode = HttpStatus[status];

    super(
      {
        timestamp: new Date().toISOString(),
        statusCode,
        error: {
          message,
          code,
          details,
        },
      },
      statusCode,
    );

    Error.captureStackTrace(this, this.constructor);
  }
}
