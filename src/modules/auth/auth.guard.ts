import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { IS_PRIVATE_KEY } from "./decorators/private.decorator";
import { AuthService } from "./services/auth.service";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { InvalidTokenException } from "./exceptions/invalidToken.exception";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const config = this.reflector.getAllAndOverride<{ getUser?: boolean }>(IS_PRIVATE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (config === undefined || config === null) return true;

    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new InvalidTokenException("access", "AUTHORIZATION_NOT_FOUND");
    }

    const token = authorization.replace("Bearer ", "");

    //If it fails, it throws an exception.
    const session = await this.authService.validate(token || "");

    if (config.getUser) {
      const user = await this.userService.findOneById(session.userId);

      if (user === null) throw new InvalidTokenException("access", "USER_NOT_FOUND");

      request.user = user;
    }

    request.session = session;

    return true;
  }
}
