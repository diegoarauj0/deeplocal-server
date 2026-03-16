import { IsString, IsUUID } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { Type } from "class-transformer";

@ApiSchema({ name: "UpdateAvatarUrlBody" })
export class UpdateAvatarUrlBodyDTO {
  @Type(() => String)
  @IsString()
  @IsUUID()
  @ApiProperty({ type: String, format: "uuid" })
  public uploadId: string;
}
