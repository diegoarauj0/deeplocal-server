import { DatabaseModule } from "./modules/database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { LinkModule } from "./modules/link/link.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [DatabaseModule, AuthModule, LinkModule],
})
export class AppModule {}
