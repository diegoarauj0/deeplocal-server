import { IsString, IsUUID } from "class-validator";
import { Type } from "class-transformer";

export class UpdateBackgroundUrlBodyDTO {
  @Type(() => String)
  @IsString()
  @IsUUID()
  public uploadId: string;
}
