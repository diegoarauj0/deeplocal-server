import { UploadIntentEntity, UploadIntentStatus } from "./uploadIntent.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult } from "typeorm/browser";
import { MongoRepository } from "typeorm";

export class UploadIntentRepository {
  constructor(
    @InjectRepository(UploadIntentEntity)
    private readonly uploadIntentRepository: MongoRepository<UploadIntentEntity>,
  ) {}

  public save(intent: UploadIntentEntity): Promise<UploadIntentEntity> {
    return this.uploadIntentRepository.save(intent);
  }

  public delete(intent: UploadIntentEntity): Promise<DeleteResult> {
    return this.uploadIntentRepository.delete({ ID: intent.ID });
  }

  public findByIdentifierAndBucket(identifier: string, bucket: string): Promise<UploadIntentEntity[]> {
    return this.uploadIntentRepository.find({ where: { identifier, bucket } });
  }

  public findByIdentifierAndStatusAndBucket(
    identifier: string,
    status: UploadIntentStatus,
    bucket: string,
  ): Promise<UploadIntentEntity[]> {
    return this.uploadIntentRepository.find({ where: { identifier, status, bucket } });
  }

  public findOneById(id: string): Promise<UploadIntentEntity | null> {
    return this.uploadIntentRepository.findOne({ where: { ID: id } });
  }

  public countByUserIdAndStatus(userId: string, status: UploadIntentStatus): Promise<number> {
    return this.uploadIntentRepository.count({
      where: { userId, status },
    });
  }

  public findByStatus(status: string): Promise<UploadIntentEntity[]> {
    return this.uploadIntentRepository.find({
      where: { status },
    });
  }

  public findExpiredByStatus(status: UploadIntentStatus[], now: Date): Promise<UploadIntentEntity[]> {
    return this.uploadIntentRepository.find({
      where: { expiresAt: { $lt: now }, status: { $in: status } },
    });
  }

  public findExpired(now: Date): Promise<UploadIntentEntity[]> {
    return this.uploadIntentRepository.find({
      where: { expiresAt: { $lt: now } },
    });
  }
}
