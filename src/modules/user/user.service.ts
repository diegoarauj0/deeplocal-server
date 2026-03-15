import { UsernameAlreadyInUseException } from "../auth/exceptions/usernameAlreadyInUse.exception";
import { EmailAlreadyInUseException } from "../auth/exceptions/emailAlreadyInUse.exception";
import { UserRepository } from "./user.repository";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { UserNotFoundException } from "./exceptions/userNotFound.exception";
import { BaseException } from "../shared/exceptions/base.exception";
import { USER_CONSTANT } from "./user.constant";
import { StorageService } from "../storage/storage.service";
import { env } from "src/env";
import { UploadIntentService } from "../upload/uploadIntent.service";
import { AvatarNotFoundException } from "./exceptions/iconNotFound.exception";
import { BackgroundNotFoundException } from "./exceptions/backgroundNotFound.exception";
import { InvalidUploadIntentException } from "../upload/exceptions/invalidUploadIntent.exception";
import { UploadAlreadyUsedException } from "../upload/exceptions/uploadAlreadyUsed.exception";
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
    const user = await this.userRepository.findOneById(id);

    if (user === null) throw new UserNotFoundException(id);

    const { uploadId, uploadUrl } = await this.uploadIntentService.createUploadUrl(
      id,
      contentType,
      this.AVATAR_BUCKET,
      USER_CONSTANT.AVATAR_CONTENT_TYPE,
    );

    return { uploadId, uploadUrl };
  }

  public async createBackgroundUploadUrl(contentType: string, id: string): Promise<{ uploadId: string; uploadUrl: string }> {
    const user = await this.userRepository.findOneById(id);

    if (user === null) throw new UserNotFoundException(id);

    const { uploadId, uploadUrl } = await this.uploadIntentService.createUploadUrl(
      id,
      contentType,
      this.BACKGROUND_BUCKET,
      USER_CONSTANT.BACKGROUND_CONTENT_TYPE,
    );

    return { uploadId, uploadUrl };
  }

  private async ensureFileExists(
    key: string,
    bucket: string,
    NotFoundException: new (key: string) => BaseException,
  ): Promise<void> {
    const result = await this.storageService.verifyFileExists(key, bucket);

    if (!result) throw new NotFoundException(key);
  }

  public async updateAvatarUploadUrl(uploadId: string): Promise<UserEntity> {
    const uploadIntent = await this.uploadIntentService.findOneById(uploadId);

    if (!uploadIntent || uploadIntent.bucket !== this.AVATAR_BUCKET) {
      throw new InvalidUploadIntentException(uploadId);
    }

    if (uploadIntent.status !== "pending") {
      throw new UploadAlreadyUsedException(uploadId, uploadIntent.status);
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

  public async updateBackgroundUploadUrl(uploadId: string): Promise<UserEntity> {
    const uploadIntent = await this.uploadIntentService.findOneById(uploadId);

    if (!uploadIntent || uploadIntent.bucket !== this.BACKGROUND_BUCKET) {
      throw new InvalidUploadIntentException(uploadId);
    }

    if (uploadIntent.status !== "pending") {
      throw new UploadAlreadyUsedException(uploadId, uploadIntent.status);
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
