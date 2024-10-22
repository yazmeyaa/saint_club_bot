import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TrophiesRecord extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column("datetime", {
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  public date: Date;

  @Column("text", {
    nullable: false,
  })
  public playerTag: string;

  @Column("integer", { nullable: false })
  public trophies: number;
}
