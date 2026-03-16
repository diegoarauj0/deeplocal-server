import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { PublicUserDTO } from "../user.mapper";

@ApiSchema({ name: "UserSuccessResponse" })
export class UserSuccessResponseDTO {
  @ApiProperty()
  user: PublicUserDTO;
}
