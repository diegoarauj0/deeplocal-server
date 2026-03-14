import { BaseException } from "src/modules/shared/exceptions/base.exception";

interface InvalidIconKeyDetails {
  key: string;
  expectedPrefix: string;
}

export class InvalidIconKeyException extends BaseException<InvalidIconKeyDetails> {
  constructor(key: string, expectedPrefix: string) {
    super("Invalid icon key", { key, expectedPrefix }, "INVALID_ICON_KEY", "BAD_REQUEST");
  }
}
