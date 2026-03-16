import { IsString, Length } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { USER_CONSTANT } from "../user.constant";
import { Type } from "class-transformer";

@ApiSchema({ name: "GetUserParam" })
export class GetUserParamDTO {
  @Type(() => String)
  @IsString()
  @Length(USER_CONSTANT.IDENTIFIER_LENGTH_MIN, USER_CONSTANT.IDENTIFIER_LENGTH_MAX)
  @ApiProperty({ type: String, minLength: USER_CONSTANT.IDENTIFIER_LENGTH_MIN, maxLength: USER_CONSTANT.IDENTIFIER_LENGTH_MAX })
  public identifier: string;
}
