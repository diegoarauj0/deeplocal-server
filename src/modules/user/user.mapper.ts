import { Expose, plainToInstance } from "class-transformer";
import { UserEntity } from "./user.entity";

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
