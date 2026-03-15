import { AccountEntity, AccountProvider } from "./account.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult } from "typeorm/browser";
import { Injectable } from "@nestjs/common";
import { MongoRepository } from "typeorm";

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: MongoRepository<AccountEntity>,
  ) {}

  public delete(session: AccountEntity): Promise<DeleteResult> {
    return this.accountRepository.delete(session);
  }

  public findByUserId(userId: string): Promise<AccountEntity[]> {
    return this.accountRepository.find({ where: { userId } });
  }

  public save(account: AccountEntity): Promise<AccountEntity> {
    return this.accountRepository.save(account);
  }

  public findOneCredentialsByUserId(userId: string): Promise<AccountEntity | null> {
    return this.accountRepository.findOne({ where: { userId, provider: AccountProvider.credential } });
  }
}
