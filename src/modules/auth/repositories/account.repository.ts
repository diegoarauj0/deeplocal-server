import { AccountEntity, AccountProvider } from "../entities/account.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  public save(account: AccountEntity): Promise<AccountEntity> {
    return this.accountRepository.save(account);
  }

  public findOneCredentialsByUserId(userId: string): Promise<AccountEntity | null> {
    return this.accountRepository.findOne({ where: { userId, provider: AccountProvider.credential } });
  }
}
