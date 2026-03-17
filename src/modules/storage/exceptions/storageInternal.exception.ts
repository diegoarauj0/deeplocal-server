import { BaseException } from "src/modules/shared/exceptions/base.exception";
import { env } from "src/env";

type StorageInternalReason =
  | "FAILED_VERIFY_FILE"
  | "FAILED_CREATE_DOWNLOAD_URL"
  | "FAILED_CREATE_UPLOAD_URL"
  | "FAILED_DELETE_FILE";
type StorageInternalDetailsReason = StorageInternalReason | "PRIVATE";

interface IStorageInternalDetails {
  reason: StorageInternalDetailsReason;
}

export class StorageInternalException extends BaseException<IStorageInternalDetails> {
  constructor(reason: StorageInternalReason) {
    const isProduction = env.NODE_ENV === "production";
    const sanitizedReason: StorageInternalDetailsReason = isProduction ? "PRIVATE" : reason;

    super("Storage operation failed", { reason: sanitizedReason }, "STORAGE_INTERNAL_ERROR_EXCEPTION", "INTERNAL_SERVER_ERROR");
  }
}
