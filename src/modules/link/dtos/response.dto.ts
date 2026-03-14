import { PublicLinkDTO } from "../link.mapper";

export class LinkSuccessResponseDTO {
  public link: PublicLinkDTO;
}

export class LinksSuccessResponseDTO {
  public links: PublicLinkDTO[];

  public length: number;
}
