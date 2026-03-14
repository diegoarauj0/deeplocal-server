import { Column, CreateDateColumn, Entity, Index, ObjectId, ObjectIdColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
  @ObjectIdColumn()
  public _id: ObjectId;

  @Index({ unique: true })
  @Column({ type: "uuid", nullable: false })
  public ID: string;

  @Index({ unique: true })
  @Column({ type: "string", nullable: false })
  public email: string;

  @Index({ unique: true })
  @Column({ type: "string", nullable: false })
  public username: string;

  @Column({ type: "string", nullable: false })
  public nickname: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
