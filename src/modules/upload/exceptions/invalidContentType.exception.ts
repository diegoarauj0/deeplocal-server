import { BaseException } from "../../shared/exceptions/base.exception";

interface IInvalidContentTypeDetails {
  acceptedContentTypes: string[];
  contentType: string;
}

export class InvalidContentTypeException extends BaseException<IInvalidContentTypeDetails> {
  constructor(contentType: string, acceptedContentTypes: string[]) {
    super("invalid content type.", { acceptedContentTypes, contentType }, "INVALID_CONTENT_TYPE_EXCEPTION", "BAD_REQUEST");
  }
}
