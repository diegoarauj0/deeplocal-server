import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult } from "typeorm/browser";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public delete(user: UserEntity): Promise<DeleteResult> {
    return this.userRepository.delete({ ID: user.ID });
  }

  public save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  public findOneById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { ID: id } });
  }

  public findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  public findOneByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { username } });
  }
}
