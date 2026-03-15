import { AccountRepository } from "./account.repository";
import { SharedModule } from "../shared/shared.module";
import { AccountService } from "./account.service";
import { AccountEntity } from "./account.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

const accountEntityRepository = TypeOrmModule.forFeature([AccountEntity]);

@Module({
  imports: [accountEntityRepository, SharedModule],
  providers: [AccountRepository, AccountService],
  exports: [AccountService],
})
export class AccountModule {}
