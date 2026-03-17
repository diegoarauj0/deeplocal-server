import { BaseException } from "src/modules/shared/exceptions/base.exception";

interface IInvalidUploadIntentDetails {
  uploadId: string;
}

export class InvalidUploadIntentException extends BaseException<IInvalidUploadIntentDetails> {
  constructor(uploadId: string) {
    super(
      `Upload intent '${uploadId}' is invalid or does not exist`,
      { uploadId },
      "INVALID_UPLOAD_INTENT_EXCEPTION",
      "NOT_FOUND",
    );
  }
}
