import { Expose, plainToInstance, Transform } from "class-transformer";
import { UserEntity } from "./user.entity";
import { env } from "src/env";

export class PublicUserDTO {
  @Expose()
  public username: UserEntity["username"];
  @Expose()
  public nickname: UserEntity["nickname"];
  @Expose()
  public createdAt: UserEntity["createdAt"];
  @Expose()
  public updatedAt: UserEntity["updatedAt"];
  @Expose()
  public ID: UserEntity["ID"];
  @Expose()
  public color: UserEntity["color"];
  @Expose()
  public bio: UserEntity["bio"];
  @Expose()
  @Transform(({ value }) => (value ? `${env.SUPABASE_URL}/storage/v1/object/public/${env.AVATAR_BUCKET}/${value}` : null))
  public avatar: UserEntity["avatar"];
  @Expose()
  @Transform(({ value }) => (value ? `${env.SUPABASE_URL}/storage/v1/object/public/${env.BACKGROUND_BUCKET}/${value}` : null))
  public background: UserEntity["background"];
}

export class PrivateUserDTO extends PublicUserDTO {
  @Expose()
  public email: string;
}

export function userEntityToPublicUser(user: UserEntity): PublicUserDTO {
  return plainToInstance<PublicUserDTO, UserEntity>(PublicUserDTO, user, {
    excludeExtraneousValues: true,
  });
}

export function userEntityToPrivateUser(user: UserEntity): PrivateUserDTO {
  return plainToInstance<PrivateUserDTO, UserEntity>(PrivateUserDTO, user, {
    excludeExtraneousValues: true,
  });
}
