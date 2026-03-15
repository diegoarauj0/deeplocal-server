import { IsIn, IsString } from "class-validator";
import { USER_CONSTANT } from "../user.constant";
import { Type } from "class-transformer";

export class CreateUploadUrlForBackgroundBodyDTO {
  @Type(() => String)
  @IsString()
  @IsIn(USER_CONSTANT.BACKGROUND_CONTENT_TYPE)
  public contentType: string;
}

export class CreateUploadUrlForBackgroundSuccessResponseDTO {
  public uploadUrl: string;

  public uploadId: string;
}
