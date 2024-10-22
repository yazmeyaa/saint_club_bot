import { Column, Entity, IsNull, Not, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TrophyRecords {
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
  day: number;

  @Column("integer", { nullable: false })
  week: number;

  @Column("integer", { nullable: false })
  month: number;
}
