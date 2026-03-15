import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionEntity } from "./session.entity";
import { SessionRepository } from "./session.repository";
import { SessionService } from "./session.service";
import { Module } from "@nestjs/common";

const sessionEntityRepository = TypeOrmModule.forFeature([SessionEntity]);

@Module({
  imports: [sessionEntityRepository],
  providers: [SessionRepository, SessionService],
  exports: [SessionService],
})
export class SessionModule {}
