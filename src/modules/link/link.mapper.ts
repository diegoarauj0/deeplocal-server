import { Expose, plainToInstance, Transform } from "class-transformer";
import { LinkEntity } from "./link.entity";
import { env } from "src/env";

export class PublicLinkDTO {
  @Expose()
  public ID: LinkEntity["ID"];
  @Expose()
  public title: LinkEntity["title"];
  @Expose()
  public url: LinkEntity["url"];
  @Expose()
  @Transform(({ value }) => (value ? `${env.SUPABASE_URL}/storage/v1/object/public/icons/${value}` : null))
  public icon: LinkEntity["icon"];
  @Expose()
  public enabled: LinkEntity["enabled"];
  @Expose()
  public position: LinkEntity["position"];
  @Expose()
  public userId: LinkEntity["userId"];
  @Expose()
  public createdAt: LinkEntity["createdAt"];
  @Expose()
  public updatedAt: LinkEntity["updatedAt"];
}

export function linkEntityToPublicLink(link: LinkEntity): PublicLinkDTO {
  return plainToInstance(PublicLinkDTO, link, {
    excludeExtraneousValues: true,
  });
}
