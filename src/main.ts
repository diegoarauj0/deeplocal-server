import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PipeConfig } from "./config/pipe.config";
import { filterConfig } from "./config/filter.config";
import { SwaggerConfig } from "./config/swagger.config";
import { CorsConfig } from "./config/cors.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  PipeConfig(app);
  filterConfig(app);
  SwaggerConfig(app);
  CorsConfig(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
