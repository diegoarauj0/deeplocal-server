import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Type } from "class-transformer";

export class ReorderLinkDTO {
  @Type(() => String)
  @IsString()
  @IsUUID()
  @IsOptional()
  public beforeId?: string;

  @Type(() => String)
  @IsString()
  @IsUUID()
  @IsOptional()
  public afterId?: string;
}

export class ReorderLinkServiceDTO extends ReorderLinkDTO {
  @Type(() => String)
  @IsUUID("4")
  @IsNotEmpty()
  public id: string;

  @Type(() => String)
  @IsUUID("4")
  @IsNotEmpty()
  public userId: string;
}
