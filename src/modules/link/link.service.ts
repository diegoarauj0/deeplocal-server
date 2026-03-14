import { ReorderConflictReferenceException } from "./exceptions/reorderConflictReference.exception";
import { InvalidContentTypeException } from "../shared/exceptions/invalidContentType.exception";
import { ReorderTargetNotFoundException } from "./exceptions/reorderTargetNotFound.exception";
import { UserNotLinkOwnerException } from "./exceptions/userNotLinkOwner.exception";
import { InvalidIconKeyException } from "./exceptions/invalidIconKey.exception";
import { IconNotFoundException } from "./exceptions/iconNotFound.exception";
import { LinkNotFoundException } from "./exceptions/linkNotFound.exception";
import { ReorderLinkServiceDTO } from "./dtos/reorderLink.dto";
import { CreateLinkServiceDTO } from "./dtos/createLink.dto";
import { UpdateLinkServiceDTO } from "./dtos/updateLink.dto";
import { StorageService } from "../storage/storage.service";
import { LinkRepository } from "./link.repository";
import { linkConstants } from "./link.constant";
import { Injectable } from "@nestjs/common";
import { LinkEntity } from "./link.entity";
import { randomUUID } from "crypto";
import mime from "mime-types";
import { env } from "src/env";

@Injectable()
export class LinkService {
  private readonly ICON_BUCKET: string = env.ICON_BUCKET;

  constructor(
    private readonly linkRepository: LinkRepository,
    private readonly storageService: StorageService,
  ) {}

  private async findLinkAndVerifyOwner(id: string, userId: string): Promise<LinkEntity> {
    const link = await this.findLinkById(id);

    if (!link) throw new LinkNotFoundException(id);

    if (link.userId !== userId) throw new UserNotLinkOwnerException();

    return link;
  }

  public async deleteAllLinksByUserId(userId: string): Promise<void> {
    const links = await this.linkRepository.findAllLinksByUserId(userId, "ASC");

    const updates = links.map((link) => {
      return this.linkRepository.deleteLink(link);
    });

    await Promise.all(updates);
  }

  public findLinkById(id: string): Promise<LinkEntity | null> {
    return this.linkRepository.findLinkById(id);
  }

  private async normalizePositions(userId: string): Promise<LinkEntity[]> {
    const links = await this.linkRepository.findAllLinksByUserId(userId, "ASC");

    const updates = links.map((link, index) => {
      link.position = (index + 1) * linkConstants.POSITION_STEP;
      return this.linkRepository.saveLink(link);
    });

    await Promise.all(updates);

    return links;
  }

  public async reorderLink({ afterId, beforeId, id, userId }: ReorderLinkServiceDTO): Promise<LinkEntity> {
    const link = await this.findLinkAndVerifyOwner(id, userId);

    if (afterId === undefined && beforeId === undefined) throw new ReorderConflictReferenceException();

    const targetId = (afterId ?? beforeId) as string;
    const type = afterId === undefined ? "before" : "after";

    // If this condition is true, it means the link is trying to change position using itself as the target
    if (targetId === id) return link;

    const targetLink = await this.linkRepository.findLinkById(targetId);

    if (targetLink === null) throw new ReorderTargetNotFoundException(targetId, type);

    if (targetLink.userId !== userId) throw new UserNotLinkOwnerException();

    if (type === "after") await this.reorderAfter(link, targetLink, userId);

    if (type === "before") await this.reorderBefore(link, targetLink, userId);

    await this.linkRepository.saveLink(link);

    return link;
  }

  private async reorderAfter(link: LinkEntity, targetLink: LinkEntity, userId: string): Promise<LinkEntity> {
    let afterLink = await this.linkRepository.findNextLinkByPosition(targetLink.position, userId);

    if (afterLink === null) {
      let gap = targetLink.position + linkConstants.POSITION_STEP;

      if (Math.abs(gap) >= linkConstants.MAX_POSITION_VALUE) {
        const newLinks = await this.normalizePositions(userId);

        targetLink = newLinks.filter(({ ID }) => ID === targetLink.ID)[0];

        gap = targetLink.position + linkConstants.POSITION_STEP;
      }

      link.position = gap;
    } else {
      // If this condition is true, it means the link is already in the desired position and no change is needed
      if (afterLink.ID === link.ID) return link;

      let gap = (targetLink.position + afterLink.position) / 2;

      if (Math.abs(gap) <= linkConstants.MIN_POSITION_GAP) {
        const newLinks = await this.normalizePositions(userId);

        afterLink = newLinks.find(({ ID }) => ID === afterLink?.ID)!;
        targetLink = newLinks.find(({ ID }) => ID === targetLink.ID)!;

        gap = (targetLink.position + afterLink.position) / 2;
      }

      link.position = gap;
    }

    return link;
  }

  public async createIconUploadUrl(contentType: string, id: string, userId: string): Promise<{ key: string; uploadUrl: string }> {
    await this.findLinkAndVerifyOwner(id, userId);

    const extension = mime.extension(contentType) as string | boolean;

    if (typeof extension !== "string") {
      throw new InvalidContentTypeException(contentType, linkConstants.ICON_CONTENT_TYPE);
    }

    const presignedUrl = await this.storageService.createPresignedUploadUrl({
      bucket: this.ICON_BUCKET,
      contentType: contentType,
      path: this.createIconPath(id, extension),
    });

    return { key: presignedUrl.path, uploadUrl: presignedUrl.signedUrl };
  }

  private createIconPath(id: string, extension: string): string {
    return `${id}/${randomUUID()}.${extension}`;
  }

  public async verifyIconExists(key: string): Promise<void> {
    const result = await this.storageService.verifyFileExists(key, this.ICON_BUCKET);

    if (!result) throw new IconNotFoundException(key);
  }

  public async updateIconUploadUrl(linkId: string, key: string, userId: string): Promise<LinkEntity> {
    await this.verifyIconExists(key);

    if (!key.startsWith(`${linkId}/`)) {
      throw new InvalidIconKeyException(key, `${linkId}/`);
    }

    const link = await this.findLinkAndVerifyOwner(linkId, userId);

    link.icon = key;

    await this.linkRepository.saveLink(link);

    return link;
  }

  private async reorderBefore(link: LinkEntity, targetLink: LinkEntity, userId: string): Promise<LinkEntity> {
    let beforeLink = await this.linkRepository.findPreviousLinkByPosition(targetLink.position, userId);

    if (beforeLink === null) {
      let gap = targetLink.position - linkConstants.POSITION_STEP;

      if (Math.abs(gap) >= linkConstants.MAX_POSITION_VALUE) {
        const newLinks = await this.normalizePositions(userId);

        targetLink = newLinks.filter(({ ID }) => ID === targetLink.ID)[0];

        gap = targetLink.position - linkConstants.POSITION_STEP;
      }

      link.position = gap;
    } else {
      // If this condition is true, it means the link is already in the desired position and no change is needed
      if (beforeLink.ID === link.ID) return link;

      let gap = beforeLink.position + (targetLink.position - beforeLink.position) / 2;

      if (Math.abs(gap) <= linkConstants.MIN_POSITION_GAP) {
        const newLinks = await this.normalizePositions(userId);

        beforeLink = newLinks.find(({ ID }) => ID === beforeLink?.ID)!;
        targetLink = newLinks.find(({ ID }) => ID === targetLink.ID)!;

        gap = beforeLink.position + (targetLink.position - beforeLink.position) / 2;
      }

      link.position = gap;
    }

    return link;
  }

  public async deleteLink(id: string, userId: string): Promise<void> {
    const link = await this.findLinkAndVerifyOwner(id, userId);

    await this.linkRepository.deleteLink(link);
  }

  public async toggleLink(id: string, userId: string): Promise<LinkEntity> {
    const link = await this.findLinkAndVerifyOwner(id, userId);

    link.enabled = !link.enabled;

    await this.linkRepository.saveLink(link);

    return link;
  }

  public findAllLinksByUserId(userId: string): Promise<LinkEntity[]> {
    return this.linkRepository.findAllLinksByUserId(userId, "ASC");
  }

  public async updateLink({ title, url, id, userId }: UpdateLinkServiceDTO): Promise<LinkEntity> {
    const link = await this.findLinkAndVerifyOwner(id, userId);

    link.title = title ?? link.title;
    link.url = url ?? link.url;

    await this.linkRepository.saveLink(link);

    return link;
  }

  public async createLink({ title, url, userId }: CreateLinkServiceDTO): Promise<LinkEntity> {
    const link = new LinkEntity();

    const lastLink = await this.linkRepository.findLastLinkByUserId(userId);

    link.position = lastLink === null ? linkConstants.POSITION_STEP : lastLink.position + linkConstants.POSITION_STEP;
    link.ID = randomUUID();
    link.userId = userId;
    link.enabled = true;
    link.title = title;
    link.url = url;

    return await this.linkRepository.saveLink(link);
  }
}
