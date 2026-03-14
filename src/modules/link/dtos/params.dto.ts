import { IsString, IsUUID } from "class-validator";
import { Type } from "class-transformer";

export class LinkIdParamDTO {
  @Type(() => String)
  @IsString()
  @IsUUID("4")
  public id: string;
}

export class UserIdParamDTO {
  @Type(() => String)
  @IsString()
  @IsUUID("4")
  public userId: string;
}
