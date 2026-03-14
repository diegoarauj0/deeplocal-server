import { InvalidCredentialException } from "../exceptions/invalidCredentials.exception";
import { InvalidTokenException } from "../exceptions/invalidToken.exception";
import { PasswordHashService } from "./passwordHash.service";
import { UserService } from "src/modules/user/user.service";
import { UserEntity } from "src/modules/user/user.entity";
import { SessionService } from "./session.service";
import { AccountService } from "./account.service";
import { TokenService } from "./token.service";
import { Injectable } from "@nestjs/common";
import { SessionEntity } from "../entities/session.entity";

interface ISignIn {
  userAgent: string;
  password: string;
  email: string;
  ip: string;
}

interface ISignUp {
  userAgent: string;
  password: string;
  username: string;
  email: string;
  ip: string;
}

interface ISignInAndSingUpSuccess {
  user: UserEntity;
  tokens: { access: string; refresh: string };
}

interface IRefreshSuccess {
  tokens: { access: string; refresh: string };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordHashService: PasswordHashService,
    private readonly sessionService: SessionService,
    private readonly accountService: AccountService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  public async signIn({ email, ip, password, userAgent }: ISignIn): Promise<ISignInAndSingUpSuccess> {
    const user = await this.userService.findOneByEmail(email);

    //In production mode, the "reason" becomes private
    if (user === null) throw new InvalidCredentialException("EMAIL_NOT_FOUND");

    const account = await this.accountService.findOneCredentialsByUserId(user.ID);

    //In production mode, the "reason" becomes private
    if (account === null) throw new InvalidCredentialException("ACCOUNT_NOT_FOUND");

    const result = await this.passwordHashService.compare(account.password, password);

    //In production mode, the "reason" becomes private
    if (!result) throw new InvalidCredentialException("INVALID_PASSWORD");

    const session = await this.sessionService.createSession(ip, userAgent, user.ID);

    const access = this.tokenService.singAccessToken(session.ID);
    const refresh = this.tokenService.singRefreshToken(session.ID);

    return { user: user, tokens: { access, refresh } };
  }

  public async signUp({ email, password, username, ip, userAgent }: ISignUp): Promise<ISignInAndSingUpSuccess> {
    const user = await this.userService.createUser(email, username);

    await this.accountService.createAccountUsingCredentials(password, user.ID);

    const session = await this.sessionService.createSession(ip, userAgent, user.ID);

    const access = this.tokenService.singAccessToken(session.ID);
    const refresh = this.tokenService.singRefreshToken(session.ID);

    return { user: user, tokens: { access, refresh } };
  }

  public async logoutAll(sessionId: string, deleteCurrentSession: boolean): Promise<void> {
    const session = await this.sessionService.findOneById(sessionId);

    if (session === null) return;

    await this.sessionService.findByUserIdAndDelete(session.userId, sessionId, deleteCurrentSession);
  }

  public async logout(sessionId: string): Promise<void> {
    const session = await this.sessionService.findOneById(sessionId);

    if (session === null) return;

    await this.sessionService.delete(session);
  }

  public async refresh(_refresh: string): Promise<IRefreshSuccess> {
    const sessionId = this.tokenService.verifyRefreshToken(_refresh);

    const _session = await this.sessionService.findOneById(sessionId);

    if (_session === null) throw new InvalidTokenException("refresh", "SESSION_NOT_FOUND");

    const session = await this.sessionService.refreshSession(_session);

    const access = this.tokenService.singAccessToken(session.ID);
    const refresh = this.tokenService.singRefreshToken(session.ID);

    return { tokens: { access, refresh } };
  }

  public async validate(_access: string): Promise<SessionEntity> {
    const sessionId = this.tokenService.verifyAccessToken(_access);

    const _session = await this.sessionService.findOneById(sessionId);

    if (_session === null) throw new InvalidTokenException("access", "SESSION_NOT_FOUND");

    return _session;
  }
}
