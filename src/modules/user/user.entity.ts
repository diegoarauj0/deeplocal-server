import { Column, CreateDateColumn, Entity, Index, ObjectId, ObjectIdColumn, UpdateDateColumn } from "typeorm";

export type UserColor = "red" | "blue" | "green" | "yellow" | "orange" | "purple" | "pink";

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

  @Column({ type: "string", nullable: true })
  public bio: string | null;

  @Column({ type: "string", nullable: true })
  public avatar: string | null;

  @Column({ type: "string", nullable: true })
  public background: string | null;

  @Column({ type: "string", nullable: true })
  public color: UserColor | null;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
