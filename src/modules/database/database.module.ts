import { TypeOrmModule } from "./typeOrmModule";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule],
})
export class DatabaseModule {}
