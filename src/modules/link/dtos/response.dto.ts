import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { PublicLinkDTO } from "../link.mapper";

@ApiSchema({ name: "LinkSuccessResponse" })
export class LinkSuccessResponseDTO {
  @ApiProperty()
  public link: PublicLinkDTO;
}

@ApiSchema({ name: "LinkSuccessResponse" })
export class LinksSuccessResponseDTO {
  @ApiProperty()
  public links: PublicLinkDTO[];

  @ApiProperty()
  public length: number;
}
