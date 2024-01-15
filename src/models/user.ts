import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @Column("integer", { unique: true, primary: true })
  telegram_id: number;

  @Column("text", { nullable: true, default: null })
  player_tag: string | null = null;

  @Column("boolean", { default: false })
  admin: boolean;
}
