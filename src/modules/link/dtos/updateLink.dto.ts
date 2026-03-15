import { IsOptional, IsString, Length, IsUrl } from "class-validator";
import { LINK_CONSTANT } from "../link.constant";
import { Type } from "class-transformer";

const URL_MAX_LENGTH = 2048;

export class UpdateLinkDTO {
  @Type(() => String)
  @IsOptional()
  @IsString()
  @Length(LINK_CONSTANT.TITLE_MIN_LENGTH, LINK_CONSTANT.TITLE_MAX_LENGTH)
  public title?: string;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @IsUrl({ protocols: ["http", "https"], require_protocol: true, require_tld: true })
  @Length(1, URL_MAX_LENGTH)
  public url?: string;
}

export interface UpdateLinkServiceDTO {
  id: string;
  userId: string;
  title?: string;
  url?: string;
}
