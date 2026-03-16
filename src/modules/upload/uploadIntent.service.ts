import { InvalidContentTypeException } from "./exceptions/invalidContentType.exception";
import { UploadIntentRepository } from "./uploadIntent.repository";
import { StorageService } from "../storage/storage.service";
import { UploadIntentEntity } from "./uploadIntent.entity";
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { randomUUID } from "crypto";
import mime from "mime-types";

@Injectable()
export class UploadIntentService {
  private readonly logger = new Logger(UploadIntentService.name);

  constructor(
    private readonly uploadIntentRepository: UploadIntentRepository,
    private readonly storageService: StorageService,
  ) {}

  @Cron("*/15 * * * *")
  public async cleanupExpiredUploads() {
    this.logger.log("Starting expired upload cleanup job");

    const expired = await this.uploadIntentRepository.findExpiredByStatus(["pending", "canceled"], new Date());

    this.logger.log(`Found ${expired.length} expired upload intents`);

    let deletedFiles = 0;
    let deletedIntents = 0;

    for (const intent of expired) {
      try {
        await this.storageService.deleteFile({
          path: intent.key,
          bucket: intent.bucket,
        });

        deletedFiles++;

        await this.uploadIntentRepository.delete(intent);
        deletedIntents++;
      } catch (err) {
        this.logger.error(`Failed to cleanup expired upload intent ${intent.ID} (${intent.bucket}/${intent.key})`, err);
      }
    }

    this.logger.log(`Expired upload cleanup finished: ${deletedFiles} files removed, ${deletedIntents} intents deleted`);
  }

  @Cron("*/10 * * * *")
  public async cleanupCompletedUploads() {
    this.logger.log("Starting completed upload intent cleanup job");

    const completed = await this.uploadIntentRepository.findByStatus("success");

    this.logger.log(`Found ${completed.length} completed upload intents`);

    let deletedIntents = 0;

    for (const intent of completed) {
      try {
        await this.uploadIntentRepository.delete(intent);
        deletedIntents++;
      } catch (err) {
        this.logger.error(`Failed to delete completed upload intent ${intent.ID}`, err);
      }
    }

    this.logger.log(`Completed upload cleanup finished: ${deletedIntents} intents deleted`);
  }

  @Cron("*/10 * * * *")
  public async cleanupUploads() {
    this.logger.log("Starting upload cleanup job");

    const expired = await this.uploadIntentRepository.findExpired(new Date());

    this.logger.log(`Found ${expired.length} expired pending upload intents`);

    let deletedFiles = 0;
    let deletedIntents = 0;

    for (const intent of expired) {
      try {
        await this.storageService.deleteFile({
          path: intent.key,
          bucket: intent.bucket,
        });

        deletedFiles++;

        if (intent.status === "pending" || intent.status === "canceled") {
          await this.uploadIntentRepository.delete(intent);
          deletedIntents++;
        }
      } catch (err) {
        this.logger.error(`Failed to cleanup upload intent ${intent.ID}`, err);
      }
    }

    this.logger.log(`Upload cleanup finished: ${deletedFiles} files removed, ${deletedIntents} intents deleted`);
  }

  public findOneById(id: string): Promise<UploadIntentEntity | null> {
    return this.uploadIntentRepository.findOneById(id);
  }

  public async deleteAllUploadsIntentByIdentifier(identifier: string, bucket: string): Promise<void> {
    const uploadsIntent = await this.uploadIntentRepository.findByIdentifierAndBucket(identifier, bucket);

    for (const uploadIntent of uploadsIntent) {
      await this.uploadIntentRepository.delete(uploadIntent);
      await this.storageService.deleteFile({ bucket: uploadIntent.bucket, path: uploadIntent.key });
    }
  }

  public async revokeAllPendingStatus(identifier: string, bucket: string): Promise<void> {
    const uploadsIntent = await this.uploadIntentRepository.findByIdentifierAndStatusAndBucket(identifier, "pending", bucket);

    for (const uploadIntent of uploadsIntent) {
      uploadIntent.status = "canceled";
      await this.uploadIntentRepository.save(uploadIntent);
    }
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

  public async createUploadUrl(identifier: string, contentType: string, bucket: string, allowedContentTypes: string[]) {
    await this.revokeAllPendingStatus(identifier, bucket);

    const extension = mime.extension(contentType);

    if (!extension || allowedContentTypes.indexOf(extension) === -1) {
      throw new InvalidContentTypeException(contentType, allowedContentTypes);
    }

    const path = `${identifier}/${randomUUID()}.${extension}`;

    const presigned = await this.storageService.createPresignedUploadUrl({
      bucket: bucket,
      contentType: contentType,
      path: path,
    });

    const { ID } = await this.createUploadIntent(bucket, identifier, presigned.path);

    return {
      uploadUrl: presigned.signedUrl,
      uploadId: ID,
    };
  }
}
