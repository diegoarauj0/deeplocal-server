import { BaseException } from "src/modules/shared/exceptions/base.exception";

export interface IStorageFileNotDetails {
  path: string;
  bucket: string;
}

export class StorageFileNotFoundException extends BaseException<IStorageFileNotDetails> {
  constructor(path: string, bucket: string) {
    super("File not found", { path, bucket }, "STORAGE_FILE_NOT_FOUND", "NOT_FOUND");
  }
}
