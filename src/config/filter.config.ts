import { INestApplication } from "@nestjs/common";
import { GlobalExceptionFilter } from "src/modules/shared/filters/globalException.filter";

export function filterConfig(app: INestApplication) {
  app.useGlobalFilters(new GlobalExceptionFilter());
}
