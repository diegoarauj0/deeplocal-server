import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { Private } from "../auth/decorators/private.decorator";
import { User } from "../auth/decorators/user.decorator";
import { LinkService } from "../link/link.service";
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import { UserSuccessResponseDTO } from "./dtos/response.dto";
import { UserNotFoundException } from "./exceptions/userNotFound.exception";
import { userEntityToPublicUser } from "./user.mapper";
import { UpdateUserBodyDTO } from "./dtos/updateUser.dto";
import { CreateUploadUrlForAvatarBodyDTO, CreateUploadUrlForAvatarSuccessResponseDTO } from "./dtos/createUploadUrlForAvatar.dto";
import {
  CreateUploadUrlForBackgroundBodyDTO,
  CreateUploadUrlForBackgroundSuccessResponseDTO,
} from "./dtos/createUploadUrlForBackground.dto";
import { UpdateAvatarUrlBodyDTO } from "./dtos/updateAvatarUrl.dto";
import { UpdateBackgroundUrlBodyDTO } from "./dtos/updateBackgroundUrl.dto";
import { GetUserParamDTO } from "./dtos/getUser.dto";
import { AccountService } from "../account/account.service";
import { SessionService } from "../session/session.service";
import { UploadIntentService } from "../upload/uploadIntent.service";
import { env } from "src/env";

@Controller("api/users")
export class UserController {
  private readonly AVATAR_BUCKET: string = env.AVATAR_BUCKET;
  private readonly BACKGROUND_BUCKET: string = env.BACKGROUND_BUCKET;

  constructor(
    private readonly userService: UserService,
    private readonly linkService: LinkService,
    private readonly accountService: AccountService,
    private readonly sessionService: SessionService,
    private readonly uploadIntentService: UploadIntentService,
  ) {}

  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  @Private({ getUser: true })
  public deleteUser(@User() user: UserEntity): void {
    this.userService.deleteUser(user);
    this.linkService.deleteAllLinksByUserId(user.ID);
    this.sessionService.deleteAllSessionsByUserId(user.ID);
    this.accountService.deleteAllAccountsByUserId(user.ID);
    this.uploadIntentService.deleteAllUploadsIntentByIdentifier(user.ID, this.AVATAR_BUCKET);
    this.uploadIntentService.deleteAllUploadsIntentByIdentifier(user.ID, this.BACKGROUND_BUCKET);
  }

  @HttpCode(HttpStatus.OK)
  @Get(":identifier")
  public async getUser(@Param() { identifier }: GetUserParamDTO): Promise<UserSuccessResponseDTO> {
    const user = await this.userService.findOneByIdOrUsername(identifier);

    if (user === null) throw new UserNotFoundException(identifier);

    return { user: userEntityToPublicUser(user) };
  }

  @Patch()
  @HttpCode(200)
  @Private({ getUser: true })
  public async updateUser(@User() { ID }: UserEntity, @Body() data: UpdateUserBodyDTO): Promise<UserSuccessResponseDTO> {
    const user = await this.userService.updateUser({ ...data, id: ID });

    return { user: userEntityToPublicUser(user) };
  }

  @HttpCode(201)
  @Post("avatar/upload-url")
  @Private({ getUser: true })
  public async createAvatarUploadUrl(
    @User() user: UserEntity,
    @Body() { contentType }: CreateUploadUrlForAvatarBodyDTO,
  ): Promise<CreateUploadUrlForAvatarSuccessResponseDTO> {
    const { uploadUrl, uploadId } = await this.userService.createAvatarUploadUrl(contentType, user.ID);

    return { uploadUrl, uploadId };
  }

  @HttpCode(200)
  @Patch("avatar")
  @Private({ getUser: true })
  public async updateAvatarUploadUrl(@Body() { uploadId }: UpdateAvatarUrlBodyDTO): Promise<UserSuccessResponseDTO> {
    const user = await this.userService.updateAvatarUploadUrl(uploadId);

    return { user: userEntityToPublicUser(user) };
  }

  @HttpCode(201)
  @Post("background/upload-url")
  @Private({ getUser: true })
  public async createBackgroundUploadUrl(
    @User() user: UserEntity,
    @Body() { contentType }: CreateUploadUrlForBackgroundBodyDTO,
  ): Promise<CreateUploadUrlForBackgroundSuccessResponseDTO> {
    const { uploadUrl, uploadId } = await this.userService.createBackgroundUploadUrl(contentType, user.ID);

    return { uploadUrl, uploadId };
  }

  @HttpCode(200)
  @Patch("background")
  @Private({ getUser: true })
  public async updateBackgroundUploadUrl(@Body() { uploadId }: UpdateBackgroundUrlBodyDTO): Promise<UserSuccessResponseDTO> {
    const user = await this.userService.updateBackgroundUploadUrl(uploadId);

    return { user: userEntityToPublicUser(user) };
  }
}
