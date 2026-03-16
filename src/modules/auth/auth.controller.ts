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
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@Controller("/api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Refresh authentication tokens",
    description: "Generates a new access token and refresh token using a valid refresh token.",
  })
  @ApiHeader({
    name: "Authorization",
    description: "Refresh token in format: Bearer <refreshToken>",
    required: true,
  })
  @ApiOkResponse({
    description: "Tokens refreshed successfully",
    type: RefreshSuccessDTO,
  })
  @ApiBadRequestResponse({
    description: "Authorization header missing or invalid.",
  })
  @ApiUnauthorizedResponse({
    description: "Refresh token is invalid or expired.",
  })
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
  @ApiOperation({
    summary: "Sign in user",
    description:
      "Authenticates a user and returns access and refresh tokens. The access token can be used in the Authorization header to access protected routes.",
  })
  @ApiHeader({
    name: "User-Agent",
    description: "Client device information",
    required: false,
  })
  @ApiOkResponse({
    description: "User authenticated successfully",
    type: SignInSuccessDTO,
  })
  @ApiBadRequestResponse({
    description: "Invalid request body.",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid email or password.",
  })
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
  @ApiOperation({
    summary: "Register new user",
    description: "Creates a new user account and returns authentication tokens.",
  })
  @ApiHeader({
    name: "User-Agent",
    description: "Client device information",
    required: false,
  })
  @ApiCreatedResponse({
    description: "User created successfully",
    type: SignUpSuccessDTO,
  })
  @ApiBadRequestResponse({
    description: "Invalid request body.",
  })
  @ApiConflictResponse({
    description: "Username or email already in use.",
  })
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
  @ApiOperation({
    summary: "Logout current session",
    description: "Invalidates the current authenticated session.",
  })
  @ApiNoContentResponse({
    description: "Session logged out successfully.",
  })
  public async logout(@Session() session: SessionEntity): Promise<void> {
    await this.authService.logout(session.ID);
  }

  @Private()
  @Delete("logoutAll")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Logout all sessions",
    description: "Invalidates all active sessions of the authenticated user.",
  })
  @ApiNoContentResponse({
    description: "All sessions logged out successfully.",
  })
  @ApiBadRequestResponse({
    description: "Invalid request body.",
  })
  public async logoutAll(@Session() session: SessionEntity, @Body() { deleteCurrentSession }: LogoutAllBodyDTO): Promise<void> {
    await this.authService.logoutAll(session.ID, deleteCurrentSession ?? true);
  }
}
