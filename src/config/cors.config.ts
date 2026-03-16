import { INestApplication } from "@nestjs/common";
import { env } from "src/env";

export function CorsConfig(app: INestApplication) {
  if (env.ORIGIN) {
    app.enableCors({
      origin: env.ORIGIN,
      credentials: true,
    });
  }
}
