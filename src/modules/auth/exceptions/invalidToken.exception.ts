import { BaseException } from "src/modules/shared/exceptions/base.exception";
import { env } from "src/env";

type InvalidTokenType = "access" | "refresh";
type InvalidTokenReason = "STRUCTURE" | "SIGNATURE" | "DATE" | "SESSION_NOT_FOUND" | "AUTHORIZATION_NOT_FOUND" | "USER_NOT_FOUND";
type InvalidTokenDetailsReason = InvalidTokenReason | "PRIVATE";

const invalidTokenMessages: Record<InvalidTokenType, string> = {
  access: "The access token is invalid.",
  refresh: "The refresh token is invalid.",
};

export interface IInvalidTokenDetails {
  type: "access" | "refresh";
  reason: InvalidTokenDetailsReason;
}

export class InvalidTokenException extends BaseException<IInvalidTokenDetails> {
  constructor(type: InvalidTokenType, reason: InvalidTokenReason) {
    const isProduction = env.NODE_ENV === "production";
    const sanitizedReason: InvalidTokenDetailsReason = isProduction ? "PRIVATE" : reason;
    const message = invalidTokenMessages[type];

    super(message, { type, reason: sanitizedReason }, "INVALID_TOKEN_EXCEPTION", "UNAUTHORIZED");
  }
}
