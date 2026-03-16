import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { Type } from "class-transformer";

@ApiSchema({ name: "LogoutAllBody" })
export class LogoutAllBodyDTO {
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    type: Boolean,
    required: false,
    default: false,
    description: "If true, it will delete the current session.",
  })
  deleteCurrentSession?: boolean;
}
