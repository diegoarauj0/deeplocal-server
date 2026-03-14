import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadIntentRepository } from "./uploadIntent.repository";
import { UploadIntentService } from "./uploadIntent.service";
import { Module } from "@nestjs/common";
import { UploadIntentEntity } from "./uploadIntent.entity";
import { StorageModule } from "../storage/storage.module";

@Module({
  imports: [StorageModule, TypeOrmModule.forFeature([UploadIntentEntity])],
  providers: [UploadIntentRepository, UploadIntentService],
  exports: [UploadIntentService],
})
export class UploadModule {}
