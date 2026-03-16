import { IsIn, IsString } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { LINK_CONSTANT } from "../link.constant";
import { Type } from "class-transformer";

@ApiSchema({ name: "CreateUploadUrl" })
export class CreateUploadUrlForIconBodyDTO {
  @Type(() => String)
  @IsString()
  @IsIn(LINK_CONSTANT.ICON_CONTENT_TYPE)
  @ApiProperty({ type: String, enum: LINK_CONSTANT.ICON_CONTENT_TYPE })
  public contentType: string;
}

@ApiSchema({ name: "CreateUploadUrlSuccess" })
export class CreateUploadUrlForIconSuccessResponseDTO {
  @ApiProperty()
  public uploadUrl: string;

  @ApiProperty()
  public uploadId: string;
}
