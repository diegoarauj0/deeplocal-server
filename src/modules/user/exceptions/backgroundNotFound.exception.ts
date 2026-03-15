import { BaseException } from "src/modules/shared/exceptions/base.exception";

interface IBackgroundNotFoundDetails {
  key: string;
}

export class BackgroundNotFoundException extends BaseException<IBackgroundNotFoundDetails> {
  constructor(key: string) {
    super("background file not found.", { key }, "BACKGROUND_NOT_FOUND", "NOT_FOUND");
  }
}
