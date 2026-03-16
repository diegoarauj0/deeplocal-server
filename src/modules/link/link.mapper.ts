import { Expose, plainToInstance, Transform } from "class-transformer";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { LinkEntity } from "./link.entity";
import { env } from "src/env";

@ApiSchema({ name: "PublicLink" })
export class PublicLinkDTO {
  @Expose()
  @ApiProperty({
    description: "Unique identifier of the link",
    example: "24b61580-7645-48d4-a9ad-48de1d2d368e",
  })
  public ID: LinkEntity["ID"];

  @Expose()
  @ApiProperty({
    description: "Title of the link",
    example: "My Portfolio",
  })
  public title: LinkEntity["title"];

  @Expose()
  @ApiProperty({
    description: "Destination URL of the link",
    example: "https://example.com",
  })
  public url: LinkEntity["url"];

  @Expose()
  @ApiProperty({
    description: "Public URL of the link icon",
    example: `${env.SUPABASE_URL}/storage/v1/object/public/${env.ICON_BUCKET}/avatar.png`,
    nullable: true,
  })
  @Transform(({ value }) => (value ? `${env.SUPABASE_URL}/storage/v1/object/public/${env.ICON_BUCKET}/${value}` : null))
  public icon: LinkEntity["icon"];

  @Expose()
  @ApiProperty({
    description: "Whether the link is visible in the public profile",
    example: true,
  })
  public enabled: LinkEntity["enabled"];

  @Expose()
  @ApiProperty({
    description: "Position of the link in the user's link list",
    example: 1000,
  })
  public position: LinkEntity["position"];

  @Expose()
  @ApiProperty({
    description: "Identifier of the user who owns the link",
    example: "42575df4-f939-47ca-982f-b8d7a0b69a73",
  })
  public userId: LinkEntity["userId"];

  @Expose()
  @ApiProperty({
    description: "Date when the link was created",
    example: "2026-03-15T12:00:00.000Z",
    format: "date-time",
  })
  public createdAt: LinkEntity["createdAt"];

  @Expose()
  @ApiProperty({
    description: "Date when the link was last updated",
    example: "2026-03-15T12:10:00.000Z",
    format: "date-time",
  })
  public updatedAt: LinkEntity["updatedAt"];
}

export function linkEntityToPublicLink(link: LinkEntity): PublicLinkDTO {
  return plainToInstance(PublicLinkDTO, link, {
    excludeExtraneousValues: true,
  });
}
