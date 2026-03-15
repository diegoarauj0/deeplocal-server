import { DatabaseModule } from "./modules/database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { LinkModule } from "./modules/link/link.module";
import { UserModule } from "./modules/user/user.module";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [DatabaseModule, LinkModule, UserModule, AuthModule, ScheduleModule.forRoot()],
})
export class AppModule {}
