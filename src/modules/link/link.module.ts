import { DatabaseModule } from "../database/database.module";
import { StorageModule } from "../storage/storage.module";
import { LinkController } from "./link.controller";
import { LinkService } from "./link.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LinkEntity } from "./link.entity";
import { LinkRepository } from "./link.repository";

@Module({
  imports: [DatabaseModule, StorageModule, TypeOrmModule.forFeature([LinkEntity])],
  providers: [LinkRepository, LinkService],
  controllers: [LinkController],
  exports: [LinkService],
})
export class LinkModule {}
