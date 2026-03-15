import { IsString, IsUUID } from "class-validator";
import { Type } from "class-transformer";

export class UpdateAvatarUrlBodyDTO {
  @Type(() => String)
  @IsString()
  @IsUUID()
  public uploadId: string;
}
