import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TrophiesRecord extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column("timestamp", {
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  public date: Date;

  @Column("text", {
    nullable: false,
    name: 'playertag'
  })
  public playerTag: string;

  @Column("integer", { nullable: false })
  public trophies: number;
}
