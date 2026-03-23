import { SessionEntity } from "./session.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { DeleteResult } from "typeorm/browser";

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  public save(account: SessionEntity): Promise<SessionEntity> {
    return this.sessionRepository.save(account);
  }

  public findOneById(id: string): Promise<SessionEntity | null> {
    return this.sessionRepository.findOne({ where: { ID: id } });
  }

  public findByUserId(userId: string): Promise<SessionEntity[]> {
    return this.sessionRepository.find({ where: { userId } });
  }

  public delete(session: SessionEntity): Promise<DeleteResult> {
    return this.sessionRepository.delete({ ID: session.ID });
  }
}
