import { IsIn, IsString } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { USER_CONSTANT } from "../user.constant";
import { Type } from "class-transformer";

@ApiSchema({ name: "CreateUploadUrlForAvatarBody" })
export class CreateUploadUrlForAvatarBodyDTO {
  @Type(() => String)
  @IsString()
  @IsIn(USER_CONSTANT.AVATAR_CONTENT_TYPE)
  @ApiProperty({ type: String, enum: USER_CONSTANT.AVATAR_CONTENT_TYPE })
  public contentType: string;
}

@ApiSchema({ name: "CreateUploadUrlForAvatarSuccessResponse" })
export class CreateUploadUrlForAvatarSuccessResponseDTO {
  @ApiProperty()
  public uploadUrl: string;

  @ApiProperty()
  public uploadId: string;
}
