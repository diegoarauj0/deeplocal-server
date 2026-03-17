import { USER_CONSTANT } from "src/modules/user/user.constant";
import { IsAlphanumeric, IsEmail, IsString, Length } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { AUTH_CONSTANT } from "../auth.constant";
import { Type } from "class-transformer";
import { PrivateUserDTO } from "src/modules/user/user.mapper";
import { TokensDTO } from "./refresh.dto";

@ApiSchema({ name: "SignUpBody" })
export class SignUpBodyDTO {
  @Type(() => String)
  @Length(USER_CONSTANT.USERNAME_LENGTH_MIN, USER_CONSTANT.USERNAME_LENGTH_MAX)
  @IsAlphanumeric()
  @IsString()
  @ApiProperty({ type: String, required: true })
  public username: string;

  @Type(() => String)
  @Length(USER_CONSTANT.EMAIL_LENGTH_MIN, USER_CONSTANT.EMAIL_LENGTH_MAX)
  @IsEmail({ allow_ip_domain: false, require_tld: true })
  @IsString()
  @ApiProperty({ type: String, format: "email", required: true })
  public email: string;

  @Type(() => String)
  @Length(AUTH_CONSTANT.PASSWORD_LENGTH_MIN, AUTH_CONSTANT.PASSWORD_LENGTH_MAX)
  @IsString()
  @ApiProperty({ type: String, required: true })
  public password: string;
}

@ApiSchema({ name: "SignUpSuccess" })
export class SignUpSuccessDTO {
  @ApiProperty()
  public user: PrivateUserDTO;
  @ApiProperty()
  public tokens: TokensDTO;
}
