import { BaseException } from "src/modules/shared/exceptions/base.exception";

export interface ILinkNotFound {
  linkId: string;
}

export class LinkNotFoundException extends BaseException<ILinkNotFound> {
  constructor(id: string) {
    super("link not found.", { linkId: id }, "LINK_NOT_FOUND_EXCEPTION", "NOT_FOUND");
  }
}
