import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Session } from "@nestjs/common";
import { CreateLinkDTO } from "./dtos/createLink.dto";
import { UpdateLinkDTO } from "./dtos/updateLink.dto";
import { LinkIdParamDTO, UserIdParamDTO } from "./dtos/params.dto";
import { LinkSuccessResponseDTO, LinksSuccessResponseDTO } from "./dtos/response.dto";
import { CreateUploadUrlForIconBodyDTO, CreateUploadUrlForIconSuccessResponseDTO } from "./dtos/createUploadUrlForIcon.dto";
import { UpdateIconUrlBodyDTO, UpdateIconUrlSuccessDTO } from "./dtos/updateIconUrl.dto";
import { ReorderLinkDTO } from "./dtos/reorderLink.dto";
import { LinkNotFoundException } from "./exceptions/linkNotFound.exception";
import { LinkService } from "./link.service";
import { linkEntityToPublicLink } from "./link.mapper";
import { Private } from "../auth/decorators/private.decorator";
import { SessionEntity } from "../session/session.entity";

@Controller("api/links")
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Patch("icon")
  @HttpCode(200)
  @Private({ getUser: true })
  public async updateIconUrl(@Body() { uploadId }: UpdateIconUrlBodyDTO): Promise<UpdateIconUrlSuccessDTO> {
    const link = await this.linkService.updateIconUploadUrl(uploadId);

    return { link: linkEntityToPublicLink(link) };
  }

  @Private()
  @Patch(":id")
  @HttpCode(200)
  public async updateLink(
    @Param() { id }: LinkIdParamDTO,
    @Session() session: SessionEntity,
    @Body() body: UpdateLinkDTO,
  ): Promise<LinkSuccessResponseDTO> {
    const link = await this.linkService.updateLink({ ...body, id, userId: session.userId });

    return { link: linkEntityToPublicLink(link) };
  }

  @Get(":id")
  public async getLink(@Param() { id }: LinkIdParamDTO): Promise<LinkSuccessResponseDTO> {
    const link = await this.linkService.findOneById(id);

    if (link === null) throw new LinkNotFoundException(id);

    return { link: linkEntityToPublicLink(link) };
  }

  @HttpCode(200)
  @Get("user/:userId")
  public async getAllLinks(@Param() { userId }: UserIdParamDTO): Promise<LinksSuccessResponseDTO> {
    const links = await this.linkService.findByUserId(userId);

    return { links: links.map((link) => linkEntityToPublicLink(link)), length: links.length };
  }

  @HttpCode(200)
  @Private()
  @Patch(":id/reorder")
  public async reorderLink(
    @Param() { id }: LinkIdParamDTO,
    @Session() session: SessionEntity,
    @Body() body: ReorderLinkDTO,
  ): Promise<LinkSuccessResponseDTO> {
    const link = await this.linkService.reorderLink({ ...body, id, userId: session.userId });

    return { link: linkEntityToPublicLink(link) };
  }

  @Post()
  @Private()
  @HttpCode(201)
  public async createLink(@Body() body: CreateLinkDTO, @Session() session: SessionEntity): Promise<LinkSuccessResponseDTO> {
    const link = await this.linkService.createLink({ ...body, userId: session.userId });

    return { link: linkEntityToPublicLink(link) };
  }

  @HttpCode(200)
  @Private()
  @Patch("toggle/:id")
  public async toggleLink(@Param() { id }: LinkIdParamDTO, @Session() session: SessionEntity): Promise<LinkSuccessResponseDTO> {
    const link = await this.linkService.toggleLink(id, session.userId);

    return { link: linkEntityToPublicLink(link) };
  }

  @HttpCode(204)
  @Private()
  @Delete(":id")
  public async deleteLink(@Param() { id }: LinkIdParamDTO, @Session() session: SessionEntity): Promise<void> {
    await this.linkService.deleteLink(id, session.userId);
  }

  @HttpCode(201)
  @Private()
  @Post("icon/upload-url/:id")
  public async createIconUploadUrl(
    @Param() { id }: LinkIdParamDTO,
    @Session() session: SessionEntity,
    @Body() { contentType }: CreateUploadUrlForIconBodyDTO,
  ): Promise<CreateUploadUrlForIconSuccessResponseDTO> {
    const { uploadUrl, uploadId } = await this.linkService.createIconUploadUrl(contentType, id, session.userId);

    return { uploadUrl, uploadId };
  }
}
