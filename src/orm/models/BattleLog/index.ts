import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { DateTransformer } from "./transformer";
import { User } from "../User";

@Entity()
@Unique("unique_battle_of_user", ["user", "battleTime"])
export class BattleLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.battleLogs)
  user: User;

  @Column("datetime", { transformer: new DateTransformer() })
  battleTime: Date;

  @Column("integer")
  trophyChange: number;
}
