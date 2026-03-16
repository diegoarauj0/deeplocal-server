import { BaseException } from "src/modules/shared/exceptions/base.exception";
import { env } from "src/env";

type InvalidCredentialsReason = "EMAIL_NOT_FOUND" | "INVALID_PASSWORD" | "ACCOUNT_NOT_FOUND";
type InvalidCredentialsDetailsReason = InvalidCredentialsReason | "PRIVATE";

const invalidCredentialsMessages: Record<InvalidCredentialsReason, string> = {
  EMAIL_NOT_FOUND: "The provided email does not match any account.",
  INVALID_PASSWORD: "The provided password is incorrect.",
  ACCOUNT_NOT_FOUND: "No credentials account exists for this user.",
};

export interface IInvalidCredentialDetails {
  reason: InvalidCredentialsDetailsReason;
}

export class InvalidCredentialException extends BaseException<IInvalidCredentialDetails> {
  constructor(reason: InvalidCredentialsReason) {
    const isProduction = env.NODE_ENV === "production";
    const sanitizedReason: InvalidCredentialsDetailsReason = isProduction ? "PRIVATE" : reason;
    const message = isProduction ? "Invalid credentials." : invalidCredentialsMessages[reason];

    super(message, { reason: sanitizedReason }, "INVALID_CREDENTIALS_EXCEPTION", "UNAUTHORIZED");
  }
}
