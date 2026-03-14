import { AccountEntity, AccountProvider } from "../entities/account.entity";
import { CredentialsAccountAlreadyExistsException } from "../exceptions/credentialsAccountAlreadyExists.exception";
import { AccountRepository } from "../repositories/account.repository";
import { PasswordHashService } from "./passwordHash.service";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly passwordHashService: PasswordHashService,
  ) {}

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
