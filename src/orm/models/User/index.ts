import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { UserTrophies } from "../UserTrophy";

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn("integer", { unique: true, primary: true })
  telegram_id: number;

  @Column("text", { nullable: true, default: null })
  player_tag: string | null = null;

  @Column("boolean", { default: false })
  admin: boolean;

  @Column("integer", { default: 0 })
  mystery_points: number;

  @OneToOne(() => UserTrophies, { eager: true })
  @JoinColumn()
  trophies: UserTrophies;
}
