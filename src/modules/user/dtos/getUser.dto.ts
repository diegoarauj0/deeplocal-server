import { IsString, Length } from "class-validator";
import { USER_CONSTANT } from "../user.constant";
import { Type } from "class-transformer";

export class GetUserParamDTO {
  @Type(() => String)
  @IsString()
  @Length(USER_CONSTANT.IDENTIFIER_LENGTH_MIN, USER_CONSTANT.IDENTIFIER_LENGTH_MAX)
  public identifier: string;
}
