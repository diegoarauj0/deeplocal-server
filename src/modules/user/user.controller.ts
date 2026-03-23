import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post } from "@nestjs/common";
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
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";

@Controller("api/users")
export class UserController {
  private readonly AVATAR_BUCKET: string = env.AVATAR_BUCKET;
  private readonly BACKGROUND_BUCKET: string = env.BACKGROUND_BUCKET;
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly linkService: LinkService,
    private readonly accountService: AccountService,
    private readonly sessionService: SessionService,
    private readonly uploadIntentService: UploadIntentService,
  ) {}

  @Delete()
  @Private({ getUser: true })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: "Delete user account",
    description:
      "Deletes the authenticated user and all related resources including links, sessions, accounts, and pending upload intents.",
  })
  @ApiAcceptedResponse({
    description: "User deletion process started successfully.",
  })
  public deleteUser(@User() user: UserEntity): void {
    void this.cleanupUserData(user).catch((err) => {
      this.logger.error(err);
    });
  }

  private async cleanupUserData(user: UserEntity) {
    const isDev = env.NODE_ENV === "development";

    const cleanupOperations: { label: string; action: () => Promise<unknown> }[] = [
      {
        label: "user record",
        action: () => this.userService.deleteUser(user),
      },
      {
        label: "links",
        action: () => this.linkService.deleteAllLinksByUserId(user.ID),
      },
      {
        label: "sessions",
        action: () => this.sessionService.deleteAllSessionsByUserId(user.ID),
      },
      {
        label: "accounts",
        action: () => this.accountService.deleteAllAccountsByUserId(user.ID),
      },
      {
        label: `avatar upload intents (bucket ${this.AVATAR_BUCKET})`,
        action: () => this.uploadIntentService.deleteAllUploadsIntentByIdentifier(user.ID, this.AVATAR_BUCKET),
      },
      {
        label: `background upload intents (bucket ${this.BACKGROUND_BUCKET})`,
        action: () => this.uploadIntentService.deleteAllUploadsIntentByIdentifier(user.ID, this.BACKGROUND_BUCKET),
      },
    ];

    await Promise.allSettled(
      cleanupOperations.map(async ({ label, action }) => {
        try {
          if (isDev) this.logger.log(`Deleting ${label} for user ${user.ID}`);

          await action();
        } catch (err) {
          const trace = err instanceof Error ? (err.stack ?? err.message) : String(err);
          this.logger.error(`Cleanup failed while deleting ${label} for user ${user.ID}`, trace);
          throw err;
        }
      }),
    );
  }

  @Get(":identifier")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get user profile",
    description: "Retrieves a user profile by user ID or username.",
  })
  @ApiOkResponse({
    description: "User retrieved successfully.",
    type: UserSuccessResponseDTO,
  })
  @ApiNotFoundResponse({
    description: "User was not found.",
  })
  public async getUser(@Param() { identifier }: GetUserParamDTO): Promise<UserSuccessResponseDTO> {
    const user = await this.userService.findOneByIdOrUsername(identifier);

    if (user === null) throw new UserNotFoundException(identifier);

    return { user: userEntityToPublicUser(user) };
  }

  @Patch()
  @Private({ getUser: true })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Update user profile",
    description: "Updates information of the authenticated user.",
  })
  @ApiOkResponse({
    description: "User updated successfully.",
    type: UserSuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: "Invalid request body.",
  })
  @ApiNotFoundResponse({
    description: "User was not found.",
  })
  public async updateUser(@User() { ID }: UserEntity, @Body() data: UpdateUserBodyDTO): Promise<UserSuccessResponseDTO> {
    const user = await this.userService.updateUser({ ...data, id: ID });

    return { user: userEntityToPublicUser(user) };
  }

  @Post("avatar/upload-url")
  @Private({ getUser: true })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create avatar upload URL",
    description: "Generates a temporary signed URL to upload a new user avatar.",
  })
  @ApiCreatedResponse({
    description: "Upload URL generated successfully.",
    type: CreateUploadUrlForAvatarSuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: "Invalid content type or request body.",
  })
  @ApiNotFoundResponse({
    description: "User was not found.",
  })
  public async createAvatarUploadUrl(
    @User() user: UserEntity,
    @Body() { contentType }: CreateUploadUrlForAvatarBodyDTO,
  ): Promise<CreateUploadUrlForAvatarSuccessResponseDTO> {
    const { uploadUrl, uploadId } = await this.userService.createAvatarUploadUrl(contentType, user.ID);

    return { uploadUrl, uploadId };
  }

  @Patch("avatar")
  @Private({ getUser: true })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Confirm avatar upload",
    description: "Associates a previously uploaded avatar file with the authenticated user using a valid uploadId.",
  })
  @ApiOkResponse({
    description: "Avatar updated successfully.",
    type: UserSuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: "Invalid request body.",
  })
  @ApiNotFoundResponse({
    description: "UploadId does not exist, the related file was not found, or the user does not exist.",
  })
  @ApiConflictResponse({
    description: "UploadId is not in the 'pending' state.",
  })
  public async updateAvatarUploadUrl(@Body() { uploadId }: UpdateAvatarUrlBodyDTO): Promise<UserSuccessResponseDTO> {
    const user = await this.userService.updateAvatarUploadUrl(uploadId);

    return { user: userEntityToPublicUser(user) };
  }

  @Post("background/upload-url")
  @Private({ getUser: true })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create background upload URL",
    description: "Generates a temporary signed URL to upload a new profile background.",
  })
  @ApiCreatedResponse({
    description: "Upload URL generated successfully.",
    type: CreateUploadUrlForBackgroundSuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: "Invalid content type or request body.",
  })
  @ApiNotFoundResponse({
    description: "User was not found.",
  })
  public async createBackgroundUploadUrl(
    @User() user: UserEntity,
    @Body() { contentType }: CreateUploadUrlForBackgroundBodyDTO,
  ): Promise<CreateUploadUrlForBackgroundSuccessResponseDTO> {
    const { uploadUrl, uploadId } = await this.userService.createBackgroundUploadUrl(contentType, user.ID);

    return { uploadUrl, uploadId };
  }

  @Patch("background")
  @Private({ getUser: true })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Confirm background upload",
    description: "Associates a previously uploaded background image with the authenticated user using a valid uploadId.",
  })
  @ApiOkResponse({
    description: "Background updated successfully.",
    type: UserSuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: "Invalid request body.",
  })
  @ApiNotFoundResponse({
    description: "UploadId does not exist, the uploaded file was not found, or the user does not exist.",
  })
  @ApiConflictResponse({
    description: "UploadId is not in the 'pending' state.",
  })
  public async updateBackgroundUploadUrl(@Body() { uploadId }: UpdateBackgroundUrlBodyDTO): Promise<UserSuccessResponseDTO> {
    const user = await this.userService.updateBackgroundUploadUrl(uploadId);

    return { user: userEntityToPublicUser(user) };
  }
}
