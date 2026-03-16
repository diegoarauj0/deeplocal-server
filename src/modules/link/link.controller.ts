import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Session } from "@nestjs/common";
import { CreateLinkBodyDTO } from "./dtos/createLink.dto";
import { UpdateLinkBodyDTO } from "./dtos/updateLink.dto";
import { LinkIdParamDTO, UserIdParamDTO } from "./dtos/params.dto";
import { LinkSuccessResponseDTO, LinksSuccessResponseDTO } from "./dtos/response.dto";
import { CreateUploadUrlForIconBodyDTO, CreateUploadUrlForIconSuccessResponseDTO } from "./dtos/createUploadUrlForIcon.dto";
import { UpdateIconUrlBodyDTO, UpdateIconUrlSuccessDTO } from "./dtos/updateIconUrl.dto";
import { LinkNotFoundException } from "./exceptions/linkNotFound.exception";
import { LinkService } from "./link.service";
import { linkEntityToPublicLink } from "./link.mapper";
import { Private } from "../auth/decorators/private.decorator";
import { SessionEntity } from "../session/session.entity";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { ReorderLinkBodyDTO } from "./dtos/reorderLink.dto";

@Controller("api/links")
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Patch("icon")
  @Private({ getUser: true })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Confirm icon upload",
    description: "Associates a previously uploaded icon with the link using a valid uploadId.",
  })
  @ApiOkResponse({
    description: "Icon successfully associated with the link.",
    type: UpdateIconUrlSuccessDTO,
  })
  @ApiNotFoundResponse({
    description: "The uploadId does not exist, the associated link does not exist, or the uploaded file was not found.",
  })
  @ApiConflictResponse({
    description: "The uploadId is not in the 'pending' state.",
  })
  public async updateIconUrl(@Body() { uploadId }: UpdateIconUrlBodyDTO): Promise<UpdateIconUrlSuccessDTO> {
    const link = await this.linkService.updateIconUploadUrl(uploadId);

    return { link: linkEntityToPublicLink(link) };
  }

  @Patch(":id")
  @Private()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Update link",
    description: "Updates the properties of an existing link.",
  })
  @ApiOkResponse({
    description: "Link updated successfully.",
    type: LinkSuccessResponseDTO,
  })
  @ApiNotFoundResponse({
    description: "The link was not found.",
  })
  @ApiForbiddenResponse({
    description: "The authenticated user is not the owner of this link.",
  })
  public async updateLink(
    @Param() { id }: LinkIdParamDTO,
    @Session() session: SessionEntity,
    @Body() body: UpdateLinkBodyDTO,
  ): Promise<LinkSuccessResponseDTO> {
    const link = await this.linkService.updateLink({ ...body, id, userId: session.userId });

    return { link: linkEntityToPublicLink(link) };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get link by ID",
    description: "Returns a single link by its identifier.",
  })
  @ApiOkResponse({
    description: "Link retrieved successfully.",
    type: LinkSuccessResponseDTO,
  })
  @ApiNotFoundResponse({
    description: "The requested link was not found.",
  })
  public async getLink(@Param() { id }: LinkIdParamDTO): Promise<LinkSuccessResponseDTO> {
    const link = await this.linkService.findOneById(id);

    if (link === null) throw new LinkNotFoundException(id);

    return { link: linkEntityToPublicLink(link) };
  }

  @Get("user/:userId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get all links of a user",
    description: "Returns all public links associated with a specific user.",
  })
  @ApiOkResponse({
    description: "User links retrieved successfully.",
    type: LinksSuccessResponseDTO,
  })
  public async getAllLinks(@Param() { userId }: UserIdParamDTO): Promise<LinksSuccessResponseDTO> {
    const links = await this.linkService.findByUserId(userId);

    return { links: links.map((link) => linkEntityToPublicLink(link)), length: links.length };
  }

  @Patch(":id/reorder")
  @Private()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Reorder link",
    description: "Changes the position of a link relative to other links belonging to the same user.",
  })
  @ApiOkResponse({
    description: "Link reordered successfully.",
    type: LinkSuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: "Invalid parameters or request body.",
  })
  @ApiNotFoundResponse({
    description: "The specified beforeId or afterId was not found.",
  })
  @ApiForbiddenResponse({
    description: "The authenticated user is not the owner of this link.",
  })
  public async reorderLink(
    @Param() { id }: LinkIdParamDTO,
    @Session() session: SessionEntity,
    @Body() body: ReorderLinkBodyDTO,
  ): Promise<LinkSuccessResponseDTO> {
    const link = await this.linkService.reorderLink({ ...body, id, userId: session.userId });

    return { link: linkEntityToPublicLink(link) };
  }

  @Post()
  @Private()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create link",
    description: "Creates a new link for the authenticated user.",
  })
  @ApiCreatedResponse({
    description: "Link created successfully.",
    type: LinkSuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: "Invalid request body.",
  })
  public async createLink(@Body() body: CreateLinkBodyDTO, @Session() session: SessionEntity): Promise<LinkSuccessResponseDTO> {
    const link = await this.linkService.createLink({ ...body, userId: session.userId });

    return { link: linkEntityToPublicLink(link) };
  }

  @Patch("toggle/:id")
  @Private()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Toggle link visibility",
    description: "Enables or disables a link. Disabled links will not appear in public profiles.",
  })
  @ApiOkResponse({
    description: "Link visibility updated successfully.",
    type: LinkSuccessResponseDTO,
  })
  @ApiForbiddenResponse({
    description: "The authenticated user is not the owner of this link.",
  })
  @ApiNotFoundResponse({
    description: "The link was not found.",
  })
  public async toggleLink(@Param() { id }: LinkIdParamDTO, @Session() session: SessionEntity): Promise<LinkSuccessResponseDTO> {
    const link = await this.linkService.toggleLink(id, session.userId);

    return { link: linkEntityToPublicLink(link) };
  }

  @Delete(":id")
  @Private()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete link",
    description: "Deletes a link owned by the authenticated user.",
  })
  @ApiNoContentResponse({
    description: "Link deleted successfully.",
  })
  @ApiForbiddenResponse({
    description: "The authenticated user is not the owner of this link.",
  })
  @ApiNotFoundResponse({
    description: "The link was not found.",
  })
  public async deleteLink(@Param() { id }: LinkIdParamDTO, @Session() session: SessionEntity): Promise<void> {
    await this.linkService.deleteLink(id, session.userId);
  }

  @Post("icon/upload-url/:id")
  @Private()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create icon upload URL",
    description: "Generates a temporary signed upload URL for uploading a link icon.",
  })
  @ApiCreatedResponse({
    description: "Upload URL generated successfully.",
    type: CreateUploadUrlForIconSuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: "Invalid parameters, request body, or content type.",
  })
  @ApiForbiddenResponse({
    description: "The authenticated user is not the owner of this link.",
  })
  @ApiNotFoundResponse({
    description: "The link was not found.",
  })
  public async createIconUploadUrl(
    @Param() { id }: LinkIdParamDTO,
    @Session() session: SessionEntity,
    @Body() { contentType }: CreateUploadUrlForIconBodyDTO,
  ): Promise<CreateUploadUrlForIconSuccessResponseDTO> {
    const { uploadUrl, uploadId } = await this.linkService.createIconUploadUrl(contentType, id, session.userId);

    return { uploadUrl, uploadId };
  }
}
