import { USER_CONSTANT } from "src/modules/user/user.constant";
import { IsAlphanumeric, IsEmail, IsString, Length } from "class-validator";
import { AUTH_CONSTANT } from "../auth.constant";
import { Type } from "class-transformer";
import { PrivateUserDTO } from "src/modules/user/user.mapper";

export class SignUpBodyDTO {
  @Type(() => String)
  @Length(USER_CONSTANT.USERNAME_LENGTH_MIN, USER_CONSTANT.USERNAME_LENGTH_MAX)
  @IsAlphanumeric()
  @IsString()
  public username: string;

  @Type(() => String)
  @Length(USER_CONSTANT.EMAIL_LENGTH_MIN, USER_CONSTANT.EMAIL_LENGTH_MAX)
  @IsEmail({ allow_ip_domain: false, require_tld: true, host_whitelist: USER_CONSTANT.EMAIL_HOST_WHITE_LIST })
  @IsString()
  public email: string;

  @Type(() => String)
  @Length(AUTH_CONSTANT.PASSWORD_LENGTH_MIN, AUTH_CONSTANT.PASSWORD_LENGTH_MAX)
  @IsString()
  public password: string;
}

export class TokensDTO {
  public access: string;
  public refresh: string;
}

export class SignUpSuccessDTO {
  public user: PrivateUserDTO;
  public tokens: TokensDTO;
}
