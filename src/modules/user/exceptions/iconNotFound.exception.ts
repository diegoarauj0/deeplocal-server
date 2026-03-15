import { BaseException } from "src/modules/shared/exceptions/base.exception";

interface IAvatarNotFoundDetails {
  key: string;
}

export class AvatarNotFoundException extends BaseException<IAvatarNotFoundDetails> {
  constructor(key: string) {
    super("avatar file not found.", { key }, "AVATAR_NOT_FOUND", "NOT_FOUND");
  }
}
