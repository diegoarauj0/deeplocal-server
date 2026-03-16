import { BaseException } from "src/modules/shared/exceptions/base.exception";

interface IUsernameAlreadyInUseDetails {
  username: string;
}

export class UsernameAlreadyInUseException extends BaseException<IUsernameAlreadyInUseDetails> {
  constructor(username: string) {
    super("The provided username is already in use.", { username }, "USERNAME_ALREADY_IN_USE", "CONFLICT");
  }
}
