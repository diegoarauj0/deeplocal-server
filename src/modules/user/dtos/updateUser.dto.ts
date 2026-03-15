import { IsIn, IsOptional, IsString, Length } from "class-validator";
import { USER_CONSTANT } from "../user.constant";
import { Type } from "class-transformer";
import type { UserColor } from "../user.entity";

export class UpdateUserBodyDTO {
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Length(USER_CONSTANT.USERNAME_LENGTH_MIN, USER_CONSTANT.USERNAME_LENGTH_MAX)
  public username: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  @Length(USER_CONSTANT.NICKNAME_LENGTH_MIN, USER_CONSTANT.NICKNAME_LENGTH_MAX)
  public nickname: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  @Length(USER_CONSTANT.BIO_LENGTH_MIN, USER_CONSTANT.BIO_LENGTH_MAX)
  public bio: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  @IsIn(USER_CONSTANT.COLOR)
  public color: UserColor;
}

export class UpdateUserServiceDTO extends UpdateUserBodyDTO {
  public id: string;
}
