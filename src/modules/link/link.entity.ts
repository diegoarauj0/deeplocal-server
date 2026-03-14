import { Column, CreateDateColumn, Entity, Index, ObjectIdColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "links" })
export class LinkEntity {
  @ObjectIdColumn({ unique: true })
  public _id: string;

  @PrimaryColumn({ unique: true })
  public ID: string;

  @Index()
  @Column({ type: "string", nullable: false })
  public userId: string;

  @Column({ type: "string", nullable: false })
  public title: string;

  @Column({ type: "string", nullable: false })
  public url: string;

  @Column({ type: "boolean", nullable: false, default: true })
  public enabled: boolean;

  @Column({ type: "string", nullable: true })
  public icon: string | null;

  @Column({ type: "number", nullable: false })
  public position: number;

  @CreateDateColumn({ type: "date" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "date" })
  public updatedAt: Date;
}
