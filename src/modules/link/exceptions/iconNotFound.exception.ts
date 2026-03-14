import { BaseException } from "src/modules/shared/exceptions/base.exception";

interface IIconNotFoundDetails {
  key: string;
}

export class IconNotFoundException extends BaseException<IIconNotFoundDetails> {
  constructor(key: string) {
    super("icon file not found.", { key }, "ICON_NOT_FOUND", "NOT_FOUND");
  }
}
