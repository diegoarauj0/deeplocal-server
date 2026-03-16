import { StorageFileNotFoundException } from "./exceptions/storageFileNotFound.exception";
import { StorageInternalException } from "./exceptions/storageInternal.exception";
import { createClient } from "@supabase/supabase-js";
import { Injectable } from "@nestjs/common";
import { env } from "src/env";
import path from "node:path";

@Injectable()
export class StorageService {
  private readonly supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  public async verifyFileExists(key: string, bucket: string): Promise<boolean> {
    const directory = path.dirname(key);
    const filename = path.basename(key);

    const { data, error } = await this.supabaseClient.storage.from(bucket).list(directory, {
      search: filename,
      limit: 1,
    });

    if (error) throw new StorageInternalException("FAILED_VERIFY_FILE");

    return data?.some((file) => file.name === filename) ?? false;
  }

  public async createPresignedUploadUrl(params: { path: string; bucket: string; contentType: string }) {
    const key = path.join(params.path);

    const { data, error } = await this.supabaseClient.storage.from(params.bucket).createSignedUploadUrl(key);

    if (error) throw new StorageInternalException("FAILED_CREATE_UPLOAD_URL");

    return {
      path: key,
      signedUrl: data.signedUrl,
      token: data.token,
    };
  }

  public async createPresignedDownloadUrl(params: { path: string; bucket: string; expiresIn: number }) {
    const { data, error } = await this.supabaseClient.storage.from(params.bucket).createSignedUrl(params.path, params.expiresIn);

    if (error) throw new StorageInternalException("FAILED_CREATE_DOWNLOAD_URL");

    if (!data?.signedUrl) new StorageFileNotFoundException(params.path, params.bucket);

    return data.signedUrl;
  }

  public async deleteFile(params: { path: string; bucket: string }): Promise<void> {
    const { error } = await this.supabaseClient.storage.from(params.bucket).remove([params.path]);

    if (error) throw new StorageInternalException("FAILED_DELETE_FILE");
  }
}
