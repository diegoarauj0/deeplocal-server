import { BaseException } from "src/modules/shared/exceptions/base.exception";

interface IUploadAlreadyUsedDetails {
  uploadId: string;
  status: string;
}

export class UploadAlreadyUsedException extends BaseException<IUploadAlreadyUsedDetails> {
  constructor(uploadId: string, status: string) {
    super(`Upload intent '${uploadId}' has already been used`, { uploadId, status }, "UPLOAD_ALREADY_USED_EXCEPTION", "CONFLICT");
  }
}
