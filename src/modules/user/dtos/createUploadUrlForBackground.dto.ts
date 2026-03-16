import { IsIn, IsString } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { USER_CONSTANT } from "../user.constant";
import { Type } from "class-transformer";

@ApiSchema({ name: "CreateUploadUrlForBackgroundBody" })
export class CreateUploadUrlForBackgroundBodyDTO {
  @Type(() => String)
  @IsString()
  @IsIn(USER_CONSTANT.BACKGROUND_CONTENT_TYPE)
  @ApiProperty({ type: String, enum: USER_CONSTANT.BACKGROUND_CONTENT_TYPE })
  public contentType: string;
}

@ApiSchema({ name: "CreateUploadUrlForBackgroundSuccessResponse" })
export class CreateUploadUrlForBackgroundSuccessResponseDTO {
  @ApiProperty()
  public uploadUrl: string;

  @ApiProperty()
  public uploadId: string;
}
