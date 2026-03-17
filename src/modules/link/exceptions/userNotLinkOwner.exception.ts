import { BaseException } from "src/modules/shared/exceptions/base.exception";

export class UserNotLinkOwnerException extends BaseException<undefined> {
  constructor() {
    super("You don't have permission to access this link", undefined, "USER_NOT_LINK_OWNER_EXCEPTION", "FORBIDDEN");
  }
}
