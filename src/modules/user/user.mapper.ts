import { Expose, plainToInstance, Transform } from "class-transformer";
import { UserEntity } from "./user.entity";
import { env } from "src/env";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema({ name: "PublicUser" })
export class PublicUserDTO {
  @Expose()
  @ApiProperty({
    description: "Unique username used in the user's profile URL",
    example: "diegoaraujo",
  })
  public username: UserEntity["username"];

  @Expose()
  @ApiProperty({
    description: "Display name chosen by the user",
    example: "Diego",
  })
  public nickname: UserEntity["nickname"];

  @Expose()
  @ApiProperty({
    description: "Date when the user account was created",
    example: "2026-03-10T12:45:00.000Z",
    format: "date-time",
  })
  public createdAt: UserEntity["createdAt"];

  @Expose()
  @ApiProperty({
    description: "Date when the user was last updated",
    example: "2026-03-12T09:30:00.000Z",
    format: "date-time",
  })
  public updatedAt: UserEntity["updatedAt"];

  @Expose()
  @ApiProperty({
    description: "Unique identifier of the user",
    example: "a12b619d-5b8b-4a1f-93ea-e85d31a07e06",
  })
  public ID: UserEntity["ID"];

  @Expose()
  @ApiProperty({
    description: "Profile accent color chosen by the user",
    example: "blue",
    nullable: true,
  })
  public color: UserEntity["color"];

  @Expose()
  @ApiProperty({
    description: "User biography",
    example:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
    nullable: true,
  })
  public bio: UserEntity["bio"];

  @Expose()
  @ApiProperty({
    description: "Public URL of the user's avatar image",
    example: `${env.SUPABASE_URL}/storage/v1/object/public/${env.AVATAR_BUCKET}/avatar.png`,
    nullable: true,
  })
  @Transform(({ value }) => (value ? `${env.SUPABASE_URL}/storage/v1/object/public/${env.AVATAR_BUCKET}/${value}` : null))
  public avatar: UserEntity["avatar"];

  @Expose()
  @ApiProperty({
    description: "Public URL of the user's background image",
    example: `${env.SUPABASE_URL}/storage/v1/object/public/${env.BACKGROUND_BUCKET}/background.png`,
    nullable: true,
  })
  @Transform(({ value }) => (value ? `${env.SUPABASE_URL}/storage/v1/object/public/${env.BACKGROUND_BUCKET}/${value}` : null))
  public background: UserEntity["background"];
}

@ApiSchema({ name: "PrivateUser" })
export class PrivateUserDTO extends PublicUserDTO {
  @Expose()
  @ApiProperty({
    description: "User email address (only visible to the authenticated user)",
    example: "diego@email.com",
    format: "email",
  })
  public email: string;
}

export function userEntityToPublicUser(user: UserEntity): PublicUserDTO {
  return plainToInstance<PublicUserDTO, UserEntity>(PublicUserDTO, user, {
    excludeExtraneousValues: true,
  });
}

export function userEntityToPrivateUser(user: UserEntity): PrivateUserDTO {
  return plainToInstance<PrivateUserDTO, UserEntity>(PrivateUserDTO, user, {
    excludeExtraneousValues: true,
  });
}
