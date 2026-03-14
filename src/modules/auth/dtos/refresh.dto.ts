import { IsNotEmpty, IsString } from "class-validator";
import { Type } from "class-transformer";

export class RefreshHeaderDTO {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  public authorization: string;
}

export class TokensDTO {
  public access: string;
  public refresh: string;
}

export class RefreshSuccessDTO {
  tokens: TokensDTO;
}
