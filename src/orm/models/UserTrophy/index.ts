import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../User";

@Entity()
export class UserTrophies extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (u) => u.trophies)
  @JoinColumn({ name: "usertelegramid" })
  public user: User;

  @Column("integer", { default: 0 })
  day: number;

  @Column("integer", { default: 0 })
  week: number;

  @Column("integer", { default: 0 })
  month: number;
}
