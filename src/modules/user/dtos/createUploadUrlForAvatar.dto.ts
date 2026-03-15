import { IsIn, IsString } from "class-validator";
import { USER_CONSTANT } from "../user.constant";
import { Type } from "class-transformer";

export class CreateUploadUrlForAvatarBodyDTO {
  @Type(() => String)
  @IsString()
  @IsIn(USER_CONSTANT.AVATAR_CONTENT_TYPE)
  public contentType: string;
}

export class CreateUploadUrlForAvatarSuccessResponseDTO {
  public uploadUrl: string;

  public uploadId: string;
}
