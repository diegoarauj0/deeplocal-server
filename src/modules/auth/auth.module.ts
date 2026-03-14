import { AccountRepository } from "./repositories/account.repository";
import { SessionRepository } from "./repositories/session.repository";
import { AccountEntity } from "./entities/account.entity";
import { SessionEntity } from "./entities/session.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { AccountService } from "./services/account.service";
import { PasswordHashService } from "./services/passwordHash.service";
import { SessionService } from "./services/session.service";
import { TokenService } from "./services/token.service";
import { UserModule } from "../user/user.module";
import { AuthGuard } from "./auth.guard";
import { APP_GUARD } from "@nestjs/core";

const authGuardProvider = {
  provide: APP_GUARD,
  useClass: AuthGuard,
};

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity]), TypeOrmModule.forFeature([SessionEntity]), UserModule],
  controllers: [AuthController],
  providers: [
    AccountRepository,
    SessionRepository,
    AuthService,
    AccountService,
    PasswordHashService,
    SessionService,
    TokenService,
    authGuardProvider,
  ],
})
export class AuthModule {}
