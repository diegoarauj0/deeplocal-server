import { InvalidTokenException } from "../exceptions/invalidToken.exception";
import { SessionEntity } from "../../session/session.entity";
import { createParamDecorator } from "@nestjs/common";
import { Request } from "express";

declare module "express" {
  export interface Request {
    session: SessionEntity;
  }
}

export const Session = createParamDecorator((data, context) => {
  const request = context.switchToHttp().getRequest<Request>();

  if (!request) {
    throw new InvalidTokenException("access", "SESSION_NOT_FOUND");
  }

  if (!request.session) {
    throw new InvalidTokenException("access", "SESSION_NOT_FOUND");
  }

  return request.session;
});
