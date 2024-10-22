import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserTrophyToUserRelationType1729603737050 implements MigrationInterface {
    name = 'ChangeUserTrophyToUserRelationType1729603737050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_user_trophies" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "day" integer NOT NULL DEFAULT (0), "week" integer NOT NULL DEFAULT (0), "month" integer NOT NULL DEFAULT (0), "userTelegramId" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_user_trophies"("id", "day", "week", "month", "userTelegramId") SELECT "id", "day", "week", "month", "userTelegramId" FROM "user_trophies"`);
        await queryRunner.query(`DROP TABLE "user_trophies"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_trophies" RENAME TO "user_trophies"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), "trophiesId" integer, "mystery_points" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_6753067be967eb35db323425fe5" UNIQUE ("trophiesId"), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"), CONSTRAINT "FK_a468898bd823b414a0d128daa54" FOREIGN KEY ("trophiesId") REFERENCES "user_trophies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("telegram_id", "player_tag", "admin", "trophiesId", "mystery_points") SELECT "telegram_id", "player_tag", "admin", "trophiesId", "mystery_points" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_trophies" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "day" integer NOT NULL DEFAULT (0), "week" integer NOT NULL DEFAULT (0), "month" integer NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "temporary_user_trophies"("id", "day", "week", "month") SELECT "id", "day", "week", "month" FROM "user_trophies"`);
        await queryRunner.query(`DROP TABLE "user_trophies"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_trophies" RENAME TO "user_trophies"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), "trophiesId" integer, "mystery_points" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_6753067be967eb35db323425fe5" UNIQUE ("trophiesId"), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"), CONSTRAINT "FK_a468898bd823b414a0d128daa54" FOREIGN KEY ("trophiesId") REFERENCES "user_trophies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("telegram_id", "player_tag", "admin", "trophiesId", "mystery_points") SELECT "telegram_id", "player_tag", "admin", "trophiesId", "mystery_points" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), "trophiesId" integer, "mystery_points" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_6753067be967eb35db323425fe5" UNIQUE ("trophiesId"), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"), CONSTRAINT "FK_a468898bd823b414a0d128daa54" FOREIGN KEY ("trophiesId") REFERENCES "user_trophies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "user"("telegram_id", "player_tag", "admin", "trophiesId", "mystery_points") SELECT "telegram_id", "player_tag", "admin", "trophiesId", "mystery_points" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "user_trophies" RENAME TO "temporary_user_trophies"`);
        await queryRunner.query(`CREATE TABLE "user_trophies" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "day" integer NOT NULL DEFAULT (0), "week" integer NOT NULL DEFAULT (0), "month" integer NOT NULL DEFAULT (0), "userTelegramId" integer)`);
        await queryRunner.query(`INSERT INTO "user_trophies"("id", "day", "week", "month") SELECT "id", "day", "week", "month" FROM "temporary_user_trophies"`);
        await queryRunner.query(`DROP TABLE "temporary_user_trophies"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), "trophiesId" integer, "mystery_points" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_6753067be967eb35db323425fe5" UNIQUE ("trophiesId"), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"), CONSTRAINT "FK_a468898bd823b414a0d128daa54" FOREIGN KEY ("trophiesId") REFERENCES "user_trophies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "user"("telegram_id", "player_tag", "admin", "trophiesId", "mystery_points") SELECT "telegram_id", "player_tag", "admin", "trophiesId", "mystery_points" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "user_trophies" RENAME TO "temporary_user_trophies"`);
        await queryRunner.query(`CREATE TABLE "user_trophies" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "day" integer NOT NULL DEFAULT (0), "week" integer NOT NULL DEFAULT (0), "month" integer NOT NULL DEFAULT (0), "userTelegramId" integer, CONSTRAINT "FK_f61db1b6af8f7f9691ce776c326" FOREIGN KEY ("userTelegramId") REFERENCES "user" ("telegram_id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "user_trophies"("id", "day", "week", "month", "userTelegramId") SELECT "id", "day", "week", "month", "userTelegramId" FROM "temporary_user_trophies"`);
        await queryRunner.query(`DROP TABLE "temporary_user_trophies"`);
    }

}
