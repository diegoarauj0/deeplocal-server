import { IsOptional, IsString, Length, IsUrl } from "class-validator";
import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { LINK_CONSTANT } from "../link.constant";
import { Type } from "class-transformer";

const URL_MAX_LENGTH = 2048;

@ApiSchema({ name: "UpdateLinkBody" })
export class UpdateLinkBodyDTO {
  @Type(() => String)
  @IsOptional()
  @IsString()
  @Length(LINK_CONSTANT.TITLE_MIN_LENGTH, LINK_CONSTANT.TITLE_MAX_LENGTH)
  @ApiPropertyOptional({ type: String, minLength: LINK_CONSTANT.TITLE_MIN_LENGTH, maxLength: LINK_CONSTANT.TITLE_MAX_LENGTH })
  public title?: string;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @IsUrl({ protocols: ["http", "https"], require_protocol: true, require_tld: true })
  @Length(1, URL_MAX_LENGTH)
  @ApiPropertyOptional({ type: String, minLength: 1, maxLength: URL_MAX_LENGTH, format: "uri" })
  public url?: string;
}

export interface UpdateLinkServiceDTO {
  id: string;
  userId: string;
  title?: string;
  url?: string;
}
