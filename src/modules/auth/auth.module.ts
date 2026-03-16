import { SessionModule } from "../session/session.module";
import { AccountModule } from "../account/account.module";
import { TokenService } from "./services/token.service";
import { SharedModule } from "../shared/shared.module";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { AuthGuard } from "./auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";

const authGuardProvider = {
  provide: APP_GUARD,
  useClass: AuthGuard,
};

@Module({
  imports: [AccountModule, SessionModule, SharedModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, authGuardProvider],
})
export class AuthModule {}
