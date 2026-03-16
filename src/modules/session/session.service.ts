import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { env } from "src/env";
import { SessionRepository } from "./session.repository";
import { SessionEntity } from "./session.entity";

@Injectable()
export class SessionService {
  private readonly SESSION_EXPIRES_IN: number = env.REFRESH_EXPIRES_IN * 1000;

  constructor(private readonly sessionRepository: SessionRepository) {}

  public async deleteSession(session: SessionEntity): Promise<void> {
    await this.sessionRepository.delete(session);
  }

  public findOneById(id: string): Promise<SessionEntity | null> {
    return this.sessionRepository.findOneById(id);
  }

  public async deleteAllSessionsByUserId(userId: string, deleteCurrentSession?: SessionEntity): Promise<void> {
    const sessions = await this.sessionRepository.findByUserId(userId);

    const filteredSession = sessions.filter((session) =>
      deleteCurrentSession === undefined ? true : session.ID !== deleteCurrentSession.ID,
    );

    for (const session of filteredSession) {
      await this.sessionRepository.delete(session);
    }
  }

  public async refreshSession(session: SessionEntity): Promise<SessionEntity> {
    session.expiresAt = new Date(new Date().getTime() + this.SESSION_EXPIRES_IN);

    return await this.sessionRepository.save(session);
  }

  public async createSession(ip: string, userAgent: string, userId: string): Promise<SessionEntity> {
    const session = new SessionEntity();

    session.expiresAt = new Date(new Date().getTime() + this.SESSION_EXPIRES_IN);
    session.ID = randomUUID();
    session.userAgent = userAgent;
    session.userId = userId;
    session.ipAddress = ip;

    return await this.sessionRepository.save(session);
  }
}
