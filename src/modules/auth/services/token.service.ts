import { JsonWebTokenError, JwtPayload, sign, verify, TokenExpiredError } from "jsonwebtoken";
import { InvalidTokenException } from "../exceptions/invalidToken.exception";
import { Injectable } from "@nestjs/common";
import { env } from "src/env";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    type: "access" | "refresh";
    sessionId: string;
  }
}

@Injectable()
export class TokenService {
  private readonly REFRESH_EXPIRES_IN: number = env.REFRESH_EXPIRES_IN;
  private readonly ACCESS_EXPIRES_IN: number = env.ACCESS_EXPIRES_IN;
  private readonly SECRET: string = env.SECRET;

  public singAccessToken(sessionId: string): string {
    return sign({ type: "access", sessionId: sessionId }, this.SECRET, { expiresIn: this.ACCESS_EXPIRES_IN });
  }

  public singRefreshToken(sessionId: string): string {
    return sign({ type: "refresh", sessionId: sessionId }, this.SECRET, { expiresIn: this.REFRESH_EXPIRES_IN });
  }

  public verifyRefreshToken(token: string): string {
    let payload: JwtPayload | undefined;

    try {
      payload = verify(token, this.SECRET) as JwtPayload;

      if (typeof payload?.sessionId !== "string" || payload?.type !== "refresh") {
        throw new InvalidTokenException("refresh", "STRUCTURE");
      }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new InvalidTokenException("refresh", "DATE");
      }

      if (err instanceof JsonWebTokenError) {
        throw new InvalidTokenException("refresh", "STRUCTURE");
      }

      throw err;
    }

    return payload?.sessionId || "";
  }

  public verifyAccessToken(token: string): string {
    let payload: JwtPayload | undefined;

    try {
      payload = verify(token, this.SECRET) as JwtPayload;

      if (typeof payload?.sessionId !== "string" || payload?.type !== "access") {
        throw new InvalidTokenException("access", "STRUCTURE");
      }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new InvalidTokenException("access", "DATE");
      }

      if (err instanceof JsonWebTokenError) {
        throw new InvalidTokenException("access", "SIGNATURE");
      }

      throw err;
    }

    return payload?.sessionId || "";
  }
}
