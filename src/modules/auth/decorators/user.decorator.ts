import { UserEntity } from "src/modules/user/user.entity";
import { createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import { InvalidTokenException } from "../exceptions/invalidToken.exception";

declare module "express" {
  export interface Request {
    user: UserEntity;
  }
}

export const User = createParamDecorator((data, context) => {
  const request = context.switchToHttp().getRequest<Request>();

  if (!request) {
    throw new InvalidTokenException("access", "USER_NOT_FOUND");
  }

  if (!request.user) {
    throw new InvalidTokenException("access", "USER_NOT_FOUND");
  }

  return request.user;
});
