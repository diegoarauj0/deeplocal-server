import { Column, CreateDateColumn, Entity, Index, ObjectId, ObjectIdColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "src/modules/user/user.entity";

export enum AccountProvider {
  "credential" = "CREDENTIAL",
}

@Entity({ name: "accounts" })
export class AccountEntity {
  @ObjectIdColumn()
  public _id: ObjectId;

  @Index({ unique: true })
  @Column({ type: "uuid", nullable: false })
  public ID: string;

  @Index()
  @Column({ type: "uuid", nullable: false })
  public userId: UserEntity["ID"];

  @Column({ type: "enum", enum: ["CREDENTIAL"], nullable: false })
  public provider: AccountProvider;

  @Column({ type: "string", nullable: false })
  public password: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
