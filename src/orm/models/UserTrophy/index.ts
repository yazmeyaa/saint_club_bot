import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class UserTrophies extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("integer", { default: 0 })
  day: number;

  @Column("integer", { default: 0 })
  week: number;

  @Column("integer", { default: 0 })
  month: number;
}
