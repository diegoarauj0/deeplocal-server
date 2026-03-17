import { BaseException } from "src/modules/shared/exceptions/base.exception";

interface IUserNotFoundDetails {
  userId: string;
}

export class UserNotFoundException extends BaseException<IUserNotFoundDetails> {
  constructor(userId: string) {
    super("user not found.", { userId }, "USER_NOT_FOUND_EXCEPTION", "NOT_FOUND");
  }
}
