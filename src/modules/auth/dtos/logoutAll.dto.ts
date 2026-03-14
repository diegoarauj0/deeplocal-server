import { IsBoolean, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class LogoutAllBodyDTO {
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  deleteCurrentSession?: boolean;
}
