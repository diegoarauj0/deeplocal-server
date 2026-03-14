import { SetMetadata } from "@nestjs/common";

export const IS_PRIVATE_KEY = "isPrivate";

export const Private = (config?: { getUser?: boolean }) => SetMetadata(IS_PRIVATE_KEY, config ?? {});
