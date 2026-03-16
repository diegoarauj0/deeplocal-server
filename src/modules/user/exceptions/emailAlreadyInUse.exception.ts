import { BaseException } from "src/modules/shared/exceptions/base.exception";

interface IEmailAlreadyInUseDetails {
  email: string;
}

export class EmailAlreadyInUseException extends BaseException<IEmailAlreadyInUseDetails> {
  constructor(email: string) {
    super("The provided email is already in use.", { email }, "EMAIL_ALREADY_IN_USE", "CONFLICT");
  }
}
