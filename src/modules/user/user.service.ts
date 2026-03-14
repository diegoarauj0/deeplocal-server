import { UsernameAlreadyInUseException } from "../auth/exceptions/usernameAlreadyInUse.exception";
import { EmailAlreadyInUseException } from "../auth/exceptions/emailAlreadyInUse.exception";
import { UserRepository } from "./user.repository";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { randomUUID } from "crypto";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public findOneById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOneById(id);
  }

  public findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneByEmail(email);
  }

  public async createUser(email: string, username: string): Promise<UserEntity> {
    const userInEmail = await this.userRepository.findOneByEmail(email);
    if (userInEmail !== null) throw new EmailAlreadyInUseException(email);

    const userInUsername = await this.userRepository.findOneByUsername(username);
    if (userInUsername !== null) throw new UsernameAlreadyInUseException(username);

    const user = new UserEntity();

    user.nickname = username;
    user.username = username;
    user.ID = randomUUID();
    user.email = email;

    await this.userRepository.save(user);

    return user;
  }
}
