import { IsString, IsUrl, Length } from "class-validator";
import { LINK_CONSTANT } from "../link.constant";
import { Type } from "class-transformer";

const URL_MAX_LENGTH = 2048;

export class CreateLinkDTO {
  @Type(() => String)
  @IsString()
  @Length(LINK_CONSTANT.TITLE_MIN_LENGTH, LINK_CONSTANT.TITLE_MAX_LENGTH)
  public title: string;

  @Type(() => String)
  @IsString()
  @IsUrl({ protocols: ["http", "https"], require_protocol: true, require_tld: true })
  @Length(1, URL_MAX_LENGTH)
  public url: string;
}

export interface CreateLinkServiceDTO {
  title: string;
  url: string;
  userId: string;
}
