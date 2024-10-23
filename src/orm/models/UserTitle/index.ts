import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserTitle extends BaseEntity {
  @PrimaryGeneratedColumn("rowid")
  public readonly id: number;

  @Column("integer", { nullable: false, unique: true })
  public pointsNeed: number;

  @Column("text", { nullable: false })
  public title: string;
}
