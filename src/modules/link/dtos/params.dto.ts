import { IsString, IsUUID } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { Type } from "class-transformer";

@ApiSchema({ name: "LinkIdParam" })
export class LinkIdParamDTO {
  @Type(() => String)
  @IsString()
  @IsUUID("4")
  @ApiProperty({ type: String, format: "uuid", description: "Link id" })
  public id: string;
}

@ApiSchema({ name: "UserIdParam" })
export class UserIdParamDTO {
  @Type(() => String)
  @IsString()
  @IsUUID("4")
  @ApiProperty({ type: String, format: "uuid", description: "User id" })
  public userId: string;
}
