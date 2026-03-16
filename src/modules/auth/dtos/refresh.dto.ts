import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { Type } from "class-transformer";

@ApiSchema({ name: "RefreshHeader" })
export class RefreshHeaderDTO {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, description: "Bearer <refresh token>" })
  public authorization: string;
}

@ApiSchema({ name: "Tokens" })
export class TokensDTO {
  @ApiProperty({
    type: "string",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwic2Vzc2lvbklkIjoiZDlmYTZlYWItZDkzZS00Yjg1LWI0OGEtZWNmZDdkYjMwOTZkIiwiaWF0IjoxNzczNzAwNTUxfQ.v3Cqq6KJmYHgj5Ft_h704IB_D7H4O1y_dbH0BRySP2Q",
  })
  public access: string;
  @ApiProperty({
    type: "string",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicmVmcmVzaCIsInNlc3Npb25JZCI6ImQ5ZmE2ZWFiLWQ5M2UtNGI4NS1iNDhhLWVjZmQ3ZGIzMDk2ZCIsImlhdCI6MTc3MzcwMDU1MX0.e1fJ6RDE4DbDsZy9pfZKCMhdVDlevx28wL6ldneHu50",
  })
  public refresh: string;
}

@ApiSchema({ name: "RefreshSuccess" })
export class RefreshSuccessDTO {
  @ApiProperty()
  tokens: TokensDTO;
}
