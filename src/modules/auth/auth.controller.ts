import { Body, Controller, Delete, Headers, HttpCode, HttpStatus, Ip, Post } from "@nestjs/common";
import { InvalidTokenException } from "./exceptions/invalidToken.exception";
import { RefreshHeaderDTO, RefreshSuccessDTO } from "./dtos/refresh.dto";
import { SignInBodyDTO, SignInSuccessDTO } from "./dtos/signIn.dto";
import { SignUpBodyDTO, SignUpSuccessDTO } from "./dtos/signUp.dto";
import { userEntityToPrivateUser } from "../user/user.mapper";
import { SessionEntity } from "../session/session.entity";
import { Session } from "./decorators/session.decorator";
import { Private } from "./decorators/private.decorator";
import { LogoutAllBodyDTO } from "./dtos/logoutAll.dto";
import { AuthService } from "./services/auth.service";

@Controller("/api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  public async refresh(@Headers() header: RefreshHeaderDTO): Promise<RefreshSuccessDTO> {
    const { authorization } = header;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new InvalidTokenException("refresh", "AUTHORIZATION_NOT_FOUND");
    }

    const token = authorization.replace("Bearer ", "");

    const { tokens } = await this.authService.refresh(token);

    return { tokens };
  }

  @Post("signIn")
  @HttpCode(HttpStatus.OK)
  public async signIn(
    @Headers("User-Agent") userAgent: string,
    @Body() body: SignInBodyDTO,
    @Ip() ip: string,
  ): Promise<SignInSuccessDTO> {
    const { email, password } = body;

    userAgent = userAgent ?? "unknown";

    const { tokens, user } = await this.authService.signIn({ email, password, userAgent, ip: ip });

    return { tokens, user: userEntityToPrivateUser(user) };
  }

  @Post("signUp")
  @HttpCode(HttpStatus.CREATED)
  public async singUp(
    @Headers("User-Agent") userAgent: string,
    @Body() body: SignUpBodyDTO,
    @Ip() ip: string,
  ): Promise<SignUpSuccessDTO> {
    const { email, password, username } = body;

    userAgent = userAgent ?? "unknown";

    const { tokens, user } = await this.authService.signUp({ email, password, username, userAgent, ip: ip });

    return { tokens, user: userEntityToPrivateUser(user) };
  }

  @Private()
  @Delete("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Session() session: SessionEntity): Promise<void> {
    await this.authService.logout(session.ID);
  }

  @Private()
  @Delete("logoutAll")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logoutAll(@Session() session: SessionEntity, @Body() { deleteCurrentSession }: LogoutAllBodyDTO): Promise<void> {
    await this.authService.logoutAll(session.ID, deleteCurrentSession ?? true);
  }
}
