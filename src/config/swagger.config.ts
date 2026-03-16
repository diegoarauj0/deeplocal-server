import { INestApplication, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { env } from "src/env";

export function SwaggerConfig(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("DeepLocal")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "Paste the access token obtained from api/auth/signIn | api/auth/signUp",
    })
    .setVersion("1.0.0")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  const logger = new Logger("swagger");

  SwaggerModule.setup("/docs", app, documentFactory);

  logger.log(`document http://127.0.0.1:${env.PORT}/docs`);
}
