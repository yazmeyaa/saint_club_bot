import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DateTransformer } from "./transformer";
import { User } from "../User";

@Entity()
export class BattleLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.battleLogs)
  user: User;

  @Column("time", { transformer: new DateTransformer() })
  battleTime: Date;

  @Column("integer")
  trophyChange: number;
}
