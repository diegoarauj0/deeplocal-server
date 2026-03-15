import { Column, CreateDateColumn, Entity, Index, ObjectId, ObjectIdColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "src/modules/user/user.entity";

@Entity({ name: "sessions" })
export class SessionEntity {
  @ObjectIdColumn()
  public _id: ObjectId;

  @Index({ unique: true })
  @Column({ type: "uuid", nullable: false })
  public ID: string;

  @Index()
  @Column({ type: "uuid", nullable: false })
  public userId: UserEntity["ID"];

  @Column({ type: "string", nullable: false })
  public userAgent: string;

  @Column({ type: "string", nullable: false })
  public ipAddress: string;

  @Index({ expireAfterSeconds: 0 })
  @Column({ type: "date", nullable: false })
  public expiresAt: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
