import { BaseException } from "src/modules/shared/exceptions/base.exception";

export class CredentialsAccountAlreadyExistsException extends BaseException<undefined> {
  constructor() {
    super(
      "A credentials account already exists for this user.",
      undefined,
      "CREDENTIAL_ACCOUNT_ALREADY_EXISTS_EXCEPTION",
      "INTERNAL_SERVER_ERROR",
    );
  }
}
