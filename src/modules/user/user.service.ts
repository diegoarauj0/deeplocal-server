import { UsernameAlreadyInUseException } from "../auth/exceptions/usernameAlreadyInUse.exception";
import { EmailAlreadyInUseException } from "../auth/exceptions/emailAlreadyInUse.exception";
import { UserRepository } from "./user.repository";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { UserNotFoundException } from "./exceptions/userNotFound.exception";
import mime from "mime-types";
import { InvalidContentTypeException } from "../shared/exceptions/invalidContentType.exception";
import { BaseException } from "../shared/exceptions/base.exception";
import { USER_CONSTANT } from "./user.constant";
import { StorageService } from "../storage/storage.service";
import { env } from "src/env";
import { UploadIntentService } from "../upload/uploadIntent.service";
import { AvatarNotFoundException } from "./exceptions/iconNotFound.exception";
import { BackgroundNotFoundException } from "./exceptions/backgroundNotFound.exception";
import { InvalidUploadIntentException } from "../upload/exceptions/invalidUploadIntent.exception";
import { UploadAlreadyUsedException } from "../upload/exceptions/uploadAlreadyUsed.exception";
import { IdentifierMismatchException } from "../upload/exceptions/identifierMismatch.exception";
import { UpdateUserServiceDTO } from "./dtos/updateUser.dto";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserService {
  private readonly AVATAR_BUCKET: string = env.AVATAR_BUCKET;
  private readonly BACKGROUND_BUCKET: string = env.BACKGROUND_BUCKET;

  constructor(
    private readonly uploadIntentService: UploadIntentService,
    private readonly userRepository: UserRepository,
    private readonly storageService: StorageService,
  ) {}

  public async findOneByIdOrUsername(identifier: string): Promise<UserEntity | null> {
    return (await this.userRepository.findOneByUsername(identifier)) || (await this.userRepository.findOneById(identifier));
  }

  public async deleteUser(user: UserEntity): Promise<void> {
    await this.userRepository.delete(user);
  }

  public findOneById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOneById(id);
  }

  public async createAvatarUploadUrl(contentType: string, id: string): Promise<{ uploadId: string; uploadUrl: string }> {
    await this.uploadIntentService.revokeAllPendingStatus(id, this.AVATAR_BUCKET);

    const user = await this.userRepository.findOneById(id);

    if (user === null) throw new UserNotFoundException(id);

    const extension = mime.extension(contentType) as string | boolean;

    if (typeof extension !== "string") {
      throw new InvalidContentTypeException(contentType, USER_CONSTANT.AVATAR_CONTENT_TYPE);
    }

    const presignedUrl = await this.storageService.createPresignedUploadUrl({
      bucket: this.AVATAR_BUCKET,
      contentType: contentType,
      path: this.createUploadPath(id, extension),
    });

    const key = presignedUrl.path;

    const { ID } = await this.uploadIntentService.createUploadIntent(this.AVATAR_BUCKET, id, key);

    return { uploadUrl: presignedUrl.signedUrl, uploadId: ID };
  }

  public async createBackgroundUploadUrl(contentType: string, id: string): Promise<{ uploadId: string; uploadUrl: string }> {
    await this.uploadIntentService.revokeAllPendingStatus(id, this.BACKGROUND_BUCKET);

    const user = await this.userRepository.findOneById(id);

    if (user === null) throw new UserNotFoundException(id);

    const extension = mime.extension(contentType) as string | boolean;

    if (typeof extension !== "string") {
      throw new InvalidContentTypeException(contentType, USER_CONSTANT.BACKGROUND_CONTENT_TYPE);
    }

    const presignedUrl = await this.storageService.createPresignedUploadUrl({
      bucket: this.BACKGROUND_BUCKET,
      contentType: contentType,
      path: this.createUploadPath(id, extension),
    });

    const key = presignedUrl.path;

    const { ID } = await this.uploadIntentService.createUploadIntent(this.BACKGROUND_BUCKET, id, key);

    return { uploadUrl: presignedUrl.signedUrl, uploadId: ID };
  }

  private createUploadPath(id: string, extension: string): string {
    return `${id}/${randomUUID()}.${extension}`;
  }

  private async ensureFileExists(
    key: string,
    bucket: string,
    NotFoundException: new (key: string) => BaseException,
  ): Promise<void> {
    const result = await this.storageService.verifyFileExists(key, bucket);

    if (!result) throw new NotFoundException(key);
  }

  public async updateAvatarUploadUrl(uploadId: string, id: string): Promise<UserEntity> {
    const uploadIntent = await this.uploadIntentService.findById(uploadId);

    if (!uploadIntent || uploadIntent.bucket !== this.AVATAR_BUCKET) {
      throw new InvalidUploadIntentException(uploadId);
    }

    if (uploadIntent.status !== "pending") {
      throw new UploadAlreadyUsedException(uploadId, uploadIntent.status);
    }

    if (id !== uploadIntent.identifier) {
      throw new IdentifierMismatchException(id, uploadIntent.identifier);
    }

    await this.ensureFileExists(uploadIntent.key, this.AVATAR_BUCKET, AvatarNotFoundException);

    const user = await this.userRepository.findOneById(uploadIntent.identifier);

    if (user === null) {
      throw new UserNotFoundException(uploadIntent.identifier);
    }

    if (user.avatar !== null) {
      await this.storageService.deleteFile({
        bucket: this.AVATAR_BUCKET,
        path: user.avatar.replace(`${this.AVATAR_BUCKET}/`, ""),
      });
    }

    user.avatar = `${this.AVATAR_BUCKET}/${uploadIntent.key}`;

    await this.userRepository.save(user);

    await this.uploadIntentService.completed(uploadIntent);

    return user;
  }

  public async updateBackgroundUploadUrl(uploadId: string, id: string): Promise<UserEntity> {
    const uploadIntent = await this.uploadIntentService.findById(uploadId);

    if (!uploadIntent || uploadIntent.bucket !== this.BACKGROUND_BUCKET) {
      throw new InvalidUploadIntentException(uploadId);
    }

    if (uploadIntent.status !== "pending") {
      throw new UploadAlreadyUsedException(uploadId, uploadIntent.status);
    }

    if (id !== uploadIntent.identifier) {
      throw new IdentifierMismatchException(id, uploadIntent.identifier);
    }

    await this.ensureFileExists(uploadIntent.key, this.BACKGROUND_BUCKET, BackgroundNotFoundException);

    const user = await this.userRepository.findOneById(uploadIntent.identifier);

    if (user === null) {
      throw new UserNotFoundException(uploadIntent.identifier);
    }

    if (user.background !== null) {
      await this.storageService.deleteFile({
        bucket: this.BACKGROUND_BUCKET,
        path: user.background.replace(`${this.BACKGROUND_BUCKET}/`, ""),
      });
    }

    user.background = `${this.BACKGROUND_BUCKET}/${uploadIntent.key}`;

    await this.userRepository.save(user);

    await this.uploadIntentService.completed(uploadIntent);

    return user;
  }

  public async updateUser({ nickname, username, bio, color, id }: UpdateUserServiceDTO): Promise<UserEntity> {
    const user = await this.userRepository.findOneById(id);

    if (user === null) throw new UserNotFoundException(id);

    user.username = username ?? user.username;
    user.nickname = nickname ?? user.nickname;
    user.color = color ?? user.color;
    user.bio = bio ?? user.bio;

    await this.userRepository.save(user);

    return user;
  }

  public findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneByEmail(email);
  }

  public async createUser(email: string, username: string): Promise<UserEntity> {
    const userInEmail = await this.userRepository.findOneByEmail(email);
    if (userInEmail !== null) throw new EmailAlreadyInUseException(email);

    const userInUsername = await this.userRepository.findOneByUsername(username);
    if (userInUsername !== null) throw new UsernameAlreadyInUseException(username);

    const user = new UserEntity();

    user.nickname = username;
    user.username = username;
    user.ID = randomUUID();
    user.email = email;

    await this.userRepository.save(user);

    return user;
  }
}
