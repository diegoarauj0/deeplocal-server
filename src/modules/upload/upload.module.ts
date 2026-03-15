import { UploadIntentRepository } from "./uploadIntent.repository";
import { UploadIntentService } from "./uploadIntent.service";
import { Module } from "@nestjs/common";
import { StorageModule } from "../storage/storage.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadIntentEntity } from "./uploadIntent.entity";

const uploadIntentEntityRepository = TypeOrmModule.forFeature([UploadIntentEntity]);

@Module({
  imports: [StorageModule, uploadIntentEntityRepository],
  providers: [UploadIntentRepository, UploadIntentService],
  exports: [UploadIntentService],
})
export class UploadModule {}
