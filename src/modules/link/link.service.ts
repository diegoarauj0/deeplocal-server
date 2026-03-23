import { ReorderConflictReferenceException } from "./exceptions/reorderConflictReference.exception";
import { ReorderTargetNotFoundException } from "./exceptions/reorderTargetNotFound.exception";
import { UserNotLinkOwnerException } from "./exceptions/userNotLinkOwner.exception";
import { IconNotFoundException } from "./exceptions/iconNotFound.exception";
import { LinkNotFoundException } from "./exceptions/linkNotFound.exception";
import { ReorderLinkServiceDTO } from "./dtos/reorderLink.dto";
import { CreateLinkServiceDTO } from "./dtos/createLink.dto";
import { UpdateLinkServiceDTO } from "./dtos/updateLink.dto";
import { StorageService } from "../storage/storage.service";
import { LinkRepository } from "./link.repository";
import { LINK_CONSTANT } from "./link.constant";
import { Injectable } from "@nestjs/common";
import { LinkEntity } from "./link.entity";
import { randomUUID } from "crypto";
import { env } from "src/env";
import { UploadIntentService } from "../upload/uploadIntent.service";
import { InvalidUploadIntentException } from "../upload/exceptions/invalidUploadIntent.exception";
import { UploadAlreadyUsedException } from "../upload/exceptions/uploadAlreadyUsed.exception";

@Injectable()
export class LinkService {
  private readonly ICON_BUCKET: string = env.ICON_BUCKET;

  constructor(
    private readonly linkRepository: LinkRepository,
    private readonly storageService: StorageService,
    private readonly uploadIntentService: UploadIntentService,
  ) {}

  private async findLinkAndVerifyOwner(id: string, userId: string): Promise<LinkEntity> {
    const link = await this.linkRepository.findOneById(id);

    if (!link) throw new LinkNotFoundException(id);

    if (link.userId !== userId) throw new UserNotLinkOwnerException();

    return link;
  }

  public async deleteAllLinksByUserId(userId: string): Promise<void> {
    const links = await this.linkRepository.findByUserId(userId, "ASC");

    const updates = links.map((link) => {
      return this.linkRepository.delete(link);
    });

    await Promise.allSettled(updates);
  }

  public findOneById(id: string): Promise<LinkEntity | null> {
    return this.linkRepository.findOneById(id);
  }

  private async normalizePositions(userId: string): Promise<LinkEntity[]> {
    const links = await this.linkRepository.findByUserId(userId, "ASC");

    const updates = links.map((link, index) => {
      link.position = (index + 1) * LINK_CONSTANT.POSITION_STEP;
      return this.linkRepository.save(link);
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

    const targetLink = await this.linkRepository.findOneById(targetId);

    if (targetLink === null) throw new ReorderTargetNotFoundException(targetId, type);

    if (targetLink.userId !== userId) throw new UserNotLinkOwnerException();

    if (type === "after") await this.reorderAfter(link, targetLink, userId);

    if (type === "before") await this.reorderBefore(link, targetLink, userId);

    await this.linkRepository.save(link);

    return link;
  }

  private async reorderAfter(link: LinkEntity, targetLink: LinkEntity, userId: string): Promise<LinkEntity> {
    let afterLink = await this.linkRepository.findNextLinkByPosition(targetLink.position, userId);

    if (afterLink === null) {
      let gap = targetLink.position + LINK_CONSTANT.POSITION_STEP;

      if (Math.abs(gap) >= LINK_CONSTANT.MAX_POSITION) {
        const newLinks = await this.normalizePositions(userId);

        targetLink = newLinks.filter(({ ID }) => ID === targetLink.ID)[0];

        gap = targetLink.position + LINK_CONSTANT.POSITION_STEP;
      }

      link.position = gap;
    } else {
      // If this condition is true, it means the link is already in the desired position and no change is needed
      if (afterLink.ID === link.ID) return link;

      const distance = Math.abs(afterLink.position - targetLink.position);

      let gap = (targetLink.position + afterLink.position) / 2;

      if (distance <= LINK_CONSTANT.MIN_GAP) {
        const newLinks = await this.normalizePositions(userId);

        afterLink = newLinks.find(({ ID }) => ID === afterLink?.ID)!;
        targetLink = newLinks.find(({ ID }) => ID === targetLink.ID)!;

        gap = (targetLink.position + afterLink.position) / 2;
      }

      link.position = gap;
    }

    return link;
  }

  public async createIconUploadUrl(
    contentType: string,
    id: string,
    userId: string,
  ): Promise<{ uploadId: string; uploadUrl: string }> {
    await this.findLinkAndVerifyOwner(id, userId);

    const { uploadId, uploadUrl } = await this.uploadIntentService.createUploadUrl(
      id,
      contentType,
      this.ICON_BUCKET,
      LINK_CONSTANT.ICON_CONTENT_TYPE,
    );

    return { uploadId, uploadUrl };
  }

  public async updateIconUploadUrl(uploadId: string): Promise<LinkEntity> {
    const uploadIntent = await this.uploadIntentService.findOneById(uploadId);

    if (!uploadIntent || uploadIntent.bucket !== this.ICON_BUCKET) {
      throw new InvalidUploadIntentException(uploadId);
    }

    if (uploadIntent.status !== "pending") {
      throw new UploadAlreadyUsedException(uploadId, uploadIntent.status);
    }

    const result = await this.storageService.verifyFileExists(uploadIntent.key, this.ICON_BUCKET);

    if (!result) throw new IconNotFoundException(uploadIntent.key);

    const link = await this.linkRepository.findOneById(uploadIntent.identifier);

    if (link === null) {
      throw new LinkNotFoundException(uploadIntent.identifier);
    }

    if (link.icon !== null) {
      await this.storageService.deleteFile({
        bucket: this.ICON_BUCKET,
        path: link.icon.replace(`${this.ICON_BUCKET}/`, ""),
      });
    }

    link.icon = uploadIntent.key;

    await this.linkRepository.save(link);

    await this.uploadIntentService.completed(uploadIntent);

    return link;
  }

  private async reorderBefore(link: LinkEntity, targetLink: LinkEntity, userId: string): Promise<LinkEntity> {
    let beforeLink = await this.linkRepository.findPreviousLinkByPosition(targetLink.position, userId);

    if (beforeLink === null) {
      let gap = targetLink.position - LINK_CONSTANT.POSITION_STEP;

      if (Math.abs(gap) >= LINK_CONSTANT.MAX_POSITION) {
        const newLinks = await this.normalizePositions(userId);

        targetLink = newLinks.filter(({ ID }) => ID === targetLink.ID)[0];

        gap = targetLink.position - LINK_CONSTANT.POSITION_STEP;
      }

      link.position = gap;
    } else {
      // If this condition is true, it means the link is already in the desired position and no change is needed
      if (beforeLink.ID === link.ID) return link;

      const distance = Math.abs(beforeLink.position - targetLink.position);

      let gap = beforeLink.position + (targetLink.position - beforeLink.position) / 2;

      if (distance <= LINK_CONSTANT.MIN_GAP) {
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

    await this.linkRepository.delete(link);
  }

  public async toggleLink(id: string, userId: string): Promise<LinkEntity> {
    const link = await this.findLinkAndVerifyOwner(id, userId);

    link.enabled = !link.enabled;

    await this.linkRepository.save(link);

    return link;
  }

  public findByUserId(userId: string): Promise<LinkEntity[]> {
    return this.linkRepository.findByUserId(userId, "ASC");
  }

  public async updateLink({ title, url, id, userId }: UpdateLinkServiceDTO): Promise<LinkEntity> {
    const link = await this.findLinkAndVerifyOwner(id, userId);

    link.title = title ?? link.title;
    link.url = url ?? link.url;

    await this.linkRepository.save(link);

    return link;
  }

  public async createLink({ title, url, userId }: CreateLinkServiceDTO): Promise<LinkEntity> {
    const link = new LinkEntity();

    const lastLink = await this.linkRepository.findLastLinkByUserId(userId);

    link.position = lastLink === null ? LINK_CONSTANT.POSITION_STEP : lastLink.position + LINK_CONSTANT.POSITION_STEP;
    link.ID = randomUUID();
    link.userId = userId;
    link.enabled = true;
    link.title = title;
    link.url = url;

    return await this.linkRepository.save(link);
  }
}
