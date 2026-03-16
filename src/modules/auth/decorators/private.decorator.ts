import { applyDecorators, SetMetadata } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";

export const IS_PRIVATE_KEY = "isPrivate";

export const Private = (config?: { getUser?: boolean }) => {
  return applyDecorators(
    SetMetadata(IS_PRIVATE_KEY, config ?? {}),
    ApiBearerAuth("access"),
    ApiUnauthorizedResponse({
      description: "Authentication required",
    }),
  );
};
