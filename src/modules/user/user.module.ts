import { StorageModule } from "../storage/storage.module";
import { UploadModule } from "../upload/upload.module";
import { UserRepository } from "./user.repository";
import { LinkModule } from "../link/link.module";
import { UserService } from "./user.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UserController } from "./user.controller";
import { SessionModule } from "../session/session.module";
import { AccountModule } from "../account/account.module";

const userEntityRepository = TypeOrmModule.forFeature([UserEntity]);

@Module({
  imports: [LinkModule, StorageModule, UploadModule, SessionModule, AccountModule, userEntityRepository],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
