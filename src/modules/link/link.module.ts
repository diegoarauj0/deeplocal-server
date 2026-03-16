import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "../database/database.module";
import { StorageModule } from "../storage/storage.module";
import { UploadModule } from "../upload/upload.module";
import { LinkController } from "./link.controller";
import { LinkRepository } from "./link.repository";
import { LinkService } from "./link.service";
import { Module } from "@nestjs/common";
import { LinkEntity } from "./link.entity";

const linkEntityRepository = TypeOrmModule.forFeature([LinkEntity]);

@Module({
  imports: [DatabaseModule, StorageModule, UploadModule, linkEntityRepository],
  providers: [LinkRepository, LinkService],
  controllers: [LinkController],
  exports: [LinkService],
})
export class LinkModule {}
