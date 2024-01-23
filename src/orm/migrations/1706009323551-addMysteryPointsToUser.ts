import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMysteryPointsToUser1706009323551 implements MigrationInterface {
    name = 'AddMysteryPointsToUser1706009323551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), "trophiesId" integer, "mystery_points" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_6753067be967eb35db323425fe5" UNIQUE ("trophiesId"), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"), CONSTRAINT "FK_a468898bd823b414a0d128daa54" FOREIGN KEY ("trophiesId") REFERENCES "user_trophies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("telegram_id", "player_tag", "admin", "trophiesId") SELECT "telegram_id", "player_tag", "admin", "trophiesId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_battle_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "battleTime" datetime NOT NULL, "trophyChange" integer NOT NULL, "userTelegramId" integer, CONSTRAINT "unique_battle_of_user" UNIQUE ("userTelegramId", "battleTime"))`);
        await queryRunner.query(`INSERT INTO "temporary_battle_log"("id", "battleTime", "trophyChange", "userTelegramId") SELECT "id", "battleTime", "trophyChange", "userTelegramId" FROM "battle_log"`);
        await queryRunner.query(`DROP TABLE "battle_log"`);
        await queryRunner.query(`ALTER TABLE "temporary_battle_log" RENAME TO "battle_log"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), "trophiesId" integer, "mystery_points" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_6753067be967eb35db323425fe5" UNIQUE ("trophiesId"), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"), CONSTRAINT "FK_a468898bd823b414a0d128daa54" FOREIGN KEY ("trophiesId") REFERENCES "user_trophies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("telegram_id", "player_tag", "admin", "trophiesId", "mystery_points") SELECT "telegram_id", "player_tag", "admin", "trophiesId", "mystery_points" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_battle_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "battleTime" datetime NOT NULL, "trophyChange" integer NOT NULL, "userTelegramId" integer, CONSTRAINT "unique_battle_of_user" UNIQUE ("userTelegramId", "battleTime"), CONSTRAINT "FK_e6edc5918d8d5d3a1c440cf1fe4" FOREIGN KEY ("userTelegramId") REFERENCES "user" ("telegram_id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_battle_log"("id", "battleTime", "trophyChange", "userTelegramId") SELECT "id", "battleTime", "trophyChange", "userTelegramId" FROM "battle_log"`);
        await queryRunner.query(`DROP TABLE "battle_log"`);
        await queryRunner.query(`ALTER TABLE "temporary_battle_log" RENAME TO "battle_log"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "battle_log" RENAME TO "temporary_battle_log"`);
        await queryRunner.query(`CREATE TABLE "battle_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "battleTime" datetime NOT NULL, "trophyChange" integer NOT NULL, "userTelegramId" integer, CONSTRAINT "unique_battle_of_user" UNIQUE ("userTelegramId", "battleTime"))`);
        await queryRunner.query(`INSERT INTO "battle_log"("id", "battleTime", "trophyChange", "userTelegramId") SELECT "id", "battleTime", "trophyChange", "userTelegramId" FROM "temporary_battle_log"`);
        await queryRunner.query(`DROP TABLE "temporary_battle_log"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), "trophiesId" integer, "mystery_points" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_6753067be967eb35db323425fe5" UNIQUE ("trophiesId"), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"), CONSTRAINT "FK_a468898bd823b414a0d128daa54" FOREIGN KEY ("trophiesId") REFERENCES "user_trophies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "user"("telegram_id", "player_tag", "admin", "trophiesId", "mystery_points") SELECT "telegram_id", "player_tag", "admin", "trophiesId", "mystery_points" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "battle_log" RENAME TO "temporary_battle_log"`);
        await queryRunner.query(`CREATE TABLE "battle_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "battleTime" datetime NOT NULL, "trophyChange" integer NOT NULL, "userTelegramId" integer, CONSTRAINT "unique_battle_of_user" UNIQUE ("userTelegramId", "battleTime"), CONSTRAINT "FK_e6edc5918d8d5d3a1c440cf1fe4" FOREIGN KEY ("userTelegramId") REFERENCES "user" ("telegram_id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "battle_log"("id", "battleTime", "trophyChange", "userTelegramId") SELECT "id", "battleTime", "trophyChange", "userTelegramId" FROM "temporary_battle_log"`);
        await queryRunner.query(`DROP TABLE "temporary_battle_log"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), "trophiesId" integer, CONSTRAINT "UQ_6753067be967eb35db323425fe5" UNIQUE ("trophiesId"), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"), CONSTRAINT "FK_a468898bd823b414a0d128daa54" FOREIGN KEY ("trophiesId") REFERENCES "user_trophies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "user"("telegram_id", "player_tag", "admin", "trophiesId") SELECT "telegram_id", "player_tag", "admin", "trophiesId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }

}
