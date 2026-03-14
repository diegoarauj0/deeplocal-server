import { DatabaseModule } from "../database/database.module";
import { StorageModule } from "../storage/storage.module";
import { LinkController } from "./link.controller";
import { LinkService } from "./link.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LinkEntity } from "./link.entity";
import { LinkRepository } from "./link.repository";
import { UploadModule } from "../upload/upload.module";

@Module({
  imports: [DatabaseModule, StorageModule, UploadModule, TypeOrmModule.forFeature([LinkEntity])],
  providers: [LinkRepository, LinkService],
  controllers: [LinkController],
  exports: [LinkService],
})
export class LinkModule {}
