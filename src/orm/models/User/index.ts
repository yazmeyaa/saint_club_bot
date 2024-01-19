import { Entity, Column, BaseEntity, PrimaryColumn, OneToMany } from "typeorm";
import { BattleLog } from "../BattleLog";

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn("integer", { unique: true, primary: true })
  telegram_id: number;

  @Column("text", { nullable: true, default: null })
  player_tag: string | null = null;

  @Column("boolean", { default: false })
  admin: boolean;

  @OneToMany(() => BattleLog, (battleLog) => battleLog.user)
  battleLogs: BattleLog[];
}
