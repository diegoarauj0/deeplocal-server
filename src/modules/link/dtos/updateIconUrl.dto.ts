import { IsString, IsUUID } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { PublicLinkDTO } from "../link.mapper";
import { Type } from "class-transformer";

@ApiSchema({ name: "UpdateIconUrlBody" })
export class UpdateIconUrlBodyDTO {
  @Type(() => String)
  @IsString()
  @IsUUID()
  @ApiProperty({ type: String, format: "uuid" })
  public uploadId: string;
}

@ApiSchema({ name: "UpdateIconUrlSuccess" })
export class UpdateIconUrlSuccessDTO {
  @ApiProperty()
  public link: PublicLinkDTO;
}
