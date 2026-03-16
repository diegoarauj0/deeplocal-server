import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { Type } from "class-transformer";

@ApiSchema({ name: "ReorderLinkBody" })
export class ReorderLinkBodyDTO {
  @Type(() => String)
  @IsString()
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ type: String, format: "uuid", description: "ID of link to move before" })
  public beforeId?: string;

  @Type(() => String)
  @IsString()
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ type: String, format: "uuid", description: "ID of link to move after" })
  public afterId?: string;
}

export class ReorderLinkServiceDTO extends ReorderLinkBodyDTO {
  @Type(() => String)
  @IsUUID("4")
  @IsNotEmpty()
  public id: string;

  @Type(() => String)
  @IsUUID("4")
  @IsNotEmpty()
  public userId: string;
}
