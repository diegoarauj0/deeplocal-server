import { USER_CONSTANT } from "src/modules/user/user.constant";
import { IsEmail, IsString, Length } from "class-validator";
import { AUTH_CONSTANT } from "../auth.constant";
import { Type } from "class-transformer";
import { PrivateUserDTO } from "src/modules/user/user.mapper";

export class SignInBodyDTO {
  @Type(() => String)
  @Length(USER_CONSTANT.EMAIL_LENGTH_MIN, USER_CONSTANT.EMAIL_LENGTH_MAX)
  @IsEmail({ allow_ip_domain: false, require_tld: true, host_whitelist: USER_CONSTANT.EMAIL_HOST_WHITE_LIST })
  @IsString()
  email: string;

  @Type(() => String)
  @Length(AUTH_CONSTANT.PASSWORD_LENGTH_MIN, AUTH_CONSTANT.PASSWORD_LENGTH_MAX)
  @IsString()
  password: string;
}

export class TokensDTO {
  public access: string;
  public refresh: string;
}

export class SignInSuccessDTO {
  public user: PrivateUserDTO;
  public tokens: TokensDTO;
}
