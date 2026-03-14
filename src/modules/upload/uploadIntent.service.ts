import { UploadIntentRepository } from "./uploadIntent.repository";
import { StorageService } from "../storage/storage.service";
import { UploadIntentEntity } from "./uploadIntent.entity";
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { randomUUID } from "crypto";

@Injectable()
export class UploadIntentService {
  private readonly logger = new Logger(UploadIntentService.name);

  constructor(
    private readonly uploadIntentRepository: UploadIntentRepository,
    private readonly storageService: StorageService,
  ) {}

  @Cron("*/10 * * * *")
  public async cleanupUploads() {
    this.logger.log("Starting upload cleanup job");

    const expired = await this.uploadIntentRepository.findExpiredPending(new Date());

    let deletedCount = 0;

    for (const intent of expired) {
      try {
        this.logger.log(`Found ${expired.length} expired uploads`);
        await this.storageService.deleteFile({ path: intent.key, bucket: intent.bucket });

        await this.uploadIntentRepository.delete(intent);
        await this.uploadIntentRepository.delete(intent);

        deletedCount++;
      } catch (err) {
        this.logger.error(`Failed to cleanup upload ${intent.ID}`, err);
      }
    }

    this.logger.log(`Cleanup finished: removed ${deletedCount} uploads`);
  }

  public findById(id: string): Promise<UploadIntentEntity | null> {
    return this.uploadIntentRepository.findById(id);
  }

  public completed(uploadIntent: UploadIntentEntity): Promise<UploadIntentEntity> {
    uploadIntent.status = "completed";
    return this.uploadIntentRepository.save(uploadIntent);
  }

  public async createUploadIntent(bucket: string, identifier: string, key: string): Promise<UploadIntentEntity> {
    const uploadIntent = new UploadIntentEntity();

    uploadIntent.expiresAt = new Date(new Date().getTime() + 7200000 /* 2 hour*/);
    uploadIntent.identifier = identifier;
    uploadIntent.bucket = bucket;
    uploadIntent.status = "pending";
    uploadIntent.key = key;
    uploadIntent.ID = randomUUID();

    return await this.uploadIntentRepository.save(uploadIntent);
  }
}
