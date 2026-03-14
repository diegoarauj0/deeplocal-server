import { Injectable } from "@nestjs/common";
import { AUTH_CONSTANT } from "../auth.constant";
import bcrypt from "bcryptjs";

@Injectable()
export class PasswordHashService {
  public async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(AUTH_CONSTANT.PASSWORD_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  public compare(hash: string, password: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
