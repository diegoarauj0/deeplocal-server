import { PublicLinkDTO } from "../link.mapper";
import { IsString, IsUUID, Length } from "class-validator";
import { linkConstants } from "../link.constant";
import { Type } from "class-transformer";

export class UpdateIconUrlBodyDTO {
  @Type(() => String)
  @IsString()
  @Length(linkConstants.KEY_MIN_LENGTH, linkConstants.KEY_MAX_LENGTH)
  public key: string;

  @Type(() => String)
  @IsString()
  @IsUUID()
  public linkId: string;
}

export class UpdateIconUrlSuccessDTO {
  public link: PublicLinkDTO;
}
