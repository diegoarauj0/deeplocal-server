import { Entity, Column, ObjectIdColumn, PrimaryColumn, Index, CreateDateColumn, UpdateDateColumn } from "typeorm";

export type UploadIntentStatus = "pending" | "completed";

@Entity({ name: "uploadIntents" })
export class UploadIntentEntity {
  @ObjectIdColumn({ unique: true })
  public _id: string;

  @PrimaryColumn({ unique: true })
  public ID: string;

  @Index()
  @Column({ type: "string", nullable: false })
  public identifier: string;

  @Column({ type: "string", nullable: false })
  public key: string;

  @Index()
  @Column({ type: "string", nullable: false, default: "pending" })
  public status: UploadIntentStatus;

  @Column({ type: "string", nullable: false })
  public bucket: string;

  @Column({ type: "date", nullable: false })
  public expiresAt: Date;

  @CreateDateColumn({ type: "date" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "date" })
  public updatedAt: Date;
}
