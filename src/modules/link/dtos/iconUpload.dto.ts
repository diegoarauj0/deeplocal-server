import { IsIn, IsString } from "class-validator";
import { linkConstants } from "../link.constant";
import { Type } from "class-transformer";

export class CreateIconUploadUrlDTO {
  @Type(() => String)
  @IsString()
  @IsIn(linkConstants.ICON_CONTENT_TYPE)
  public contentType: string;
}

export class CreateIconUploadUrlSuccessResponseDTO {
  public uploadUrl: string;

  public key: string;
}
