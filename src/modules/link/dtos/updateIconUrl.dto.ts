import { IsString, IsUUID } from "class-validator";
import { PublicLinkDTO } from "../link.mapper";
import { Type } from "class-transformer";

export class UpdateIconUrlBodyDTO {
  @Type(() => String)
  @IsString()
  @IsUUID()
  public uploadId: string;
}

export class UpdateIconUrlSuccessDTO {
  public link: PublicLinkDTO;
}
