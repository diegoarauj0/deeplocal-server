import { CredentialsAccountAlreadyExistsException } from "../auth/exceptions/credentialsAccountAlreadyExists.exception";
import { PasswordHashService } from "src/modules/shared/passwordHash.service";
import { AccountEntity, AccountProvider } from "./account.entity";
import { AccountRepository } from "./account.repository";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  public async deleteAllAccountsByUserId(userId: string): Promise<void> {
    const links = await this.accountRepository.findByUserId(userId);

    const updates = links.map((link) => {
      return this.accountRepository.delete(link);
    });

    await Promise.all(updates);
  }

  public async findOneCredentialsByUserId(userId: string): Promise<AccountEntity | null> {
    return await this.accountRepository.findOneCredentialsByUserId(userId);
  }

  public async createAccountUsingCredentials(password: string, userId: string): Promise<AccountEntity> {
    const _account = await this.findOneCredentialsByUserId(userId);
    if (_account !== null) throw new CredentialsAccountAlreadyExistsException();

    const hash = await this.passwordHashService.hash(password);

    const account = new AccountEntity();

    account.provider = AccountProvider.credential;
    account.ID = randomUUID();
    account.password = hash;
    account.userId = userId;

    await this.accountRepository.save(account);

    return account;
  }
}
