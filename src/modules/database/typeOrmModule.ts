import * as TypeOrm from "@nestjs/typeorm";
import { env } from "src/env";

export const TypeOrmModule = TypeOrm.TypeOrmModule.forRoot({
  autoLoadEntities: true,
  synchronize: true,
  url: env.MONGODB,
  type: "mongodb",
});
