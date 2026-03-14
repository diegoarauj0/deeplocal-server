import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ValidationErrorException } from "src/modules/shared/exceptions/validationError.exception";

export function PipeConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        return new ValidationErrorException(errors);
      },
    }),
  );
}
