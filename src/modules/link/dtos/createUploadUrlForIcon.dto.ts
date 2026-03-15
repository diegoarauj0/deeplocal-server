import { IsIn, IsString } from "class-validator";
import { LINK_CONSTANT } from "../link.constant";
import { Type } from "class-transformer";

export class CreateUploadUrlForIconBodyDTO {
  @Type(() => String)
  @IsString()
  @IsIn(LINK_CONSTANT.ICON_CONTENT_TYPE)
  public contentType: string;
}

export class CreateUploadUrlForIconSuccessResponseDTO {
  public uploadUrl: string;

  public uploadId: string;
}
