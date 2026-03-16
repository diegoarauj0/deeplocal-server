import { IsString, IsUrl, Length } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { LINK_CONSTANT } from "../link.constant";
import { Type } from "class-transformer";

const URL_MAX_LENGTH = 2048;

@ApiSchema({ name: "CreateLinkBody" })
export class CreateLinkBodyDTO {
  @Type(() => String)
  @IsString()
  @Length(LINK_CONSTANT.TITLE_MIN_LENGTH, LINK_CONSTANT.TITLE_MAX_LENGTH)
  @ApiProperty({
    type: String,
    required: true,
    minLength: LINK_CONSTANT.TITLE_MIN_LENGTH,
    maxLength: LINK_CONSTANT.TITLE_MAX_LENGTH,
  })
  public title: string;

  @Type(() => String)
  @IsString()
  @IsUrl({ protocols: ["http", "https"], require_protocol: true, require_tld: true })
  @Length(1, URL_MAX_LENGTH)
  @ApiProperty({ type: String, required: true, minLength: 1, maxLength: URL_MAX_LENGTH, format: "uri" })
  public url: string;
}

export interface CreateLinkServiceDTO {
  title: string;
  url: string;
  userId: string;
}
