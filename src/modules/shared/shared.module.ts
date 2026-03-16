import { PasswordHashService } from "./passwordHash.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [PasswordHashService],
  exports: [PasswordHashService],
})
export class SharedModule {}
