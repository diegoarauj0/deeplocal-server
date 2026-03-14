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

  public findById(id: string): Promise<UploadIntentEntity | null> {
    return this.uploadIntentRepository.findOne({ where: { ID: id } });
  }

  public countByUserIdAndStatus(userId: string, status: UploadIntentStatus): Promise<number> {
    return this.uploadIntentRepository.count({
      where: { userId, status },
    });
  }

  public findExpiredPending(now: Date): Promise<UploadIntentEntity[]> {
    return this.uploadIntentRepository.find({
      where: {
        status: "pending",
        expiresAt: { $lt: now },
      },
    });
  }
}
