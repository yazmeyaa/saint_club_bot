import { MigrationInterface, QueryRunner } from "typeorm";

export class Updateschemabattlelog1705687798028 implements MigrationInterface {
    name = 'Updateschemabattlelog1705687798028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("telegram_id", "player_tag", "admin") SELECT "telegram_id", "player_tag", "admin" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_battle_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "battleTime" datetime NOT NULL, "trophyChange" integer NOT NULL, "userTelegramId" integer, CONSTRAINT "unique_battle_of_user" UNIQUE ("userTelegramId", "battleTime"))`);
        await queryRunner.query(`INSERT INTO "temporary_battle_log"("id", "battleTime", "trophyChange", "userTelegramId") SELECT "id", "battleTime", "trophyChange", "userTelegramId" FROM "battle_log"`);
        await queryRunner.query(`DROP TABLE "battle_log"`);
        await queryRunner.query(`ALTER TABLE "temporary_battle_log" RENAME TO "battle_log"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("telegram_id", "player_tag", "admin") SELECT "telegram_id", "player_tag", "admin" FROM "user"`);
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
        await queryRunner.query(`CREATE TABLE "user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"))`);
        await queryRunner.query(`INSERT INTO "user"("telegram_id", "player_tag", "admin") SELECT "telegram_id", "player_tag", "admin" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "battle_log" RENAME TO "temporary_battle_log"`);
        await queryRunner.query(`CREATE TABLE "battle_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "battleTime" datetime NOT NULL, "trophyChange" integer NOT NULL, "userTelegramId" integer, CONSTRAINT "unique_battle_of_user" UNIQUE ("userTelegramId", "battleTime"), CONSTRAINT "FK_e6edc5918d8d5d3a1c440cf1fe4" FOREIGN KEY ("userTelegramId") REFERENCES "user" ("telegram_id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "battle_log"("id", "battleTime", "trophyChange", "userTelegramId") SELECT "id", "battleTime", "trophyChange", "userTelegramId" FROM "temporary_battle_log"`);
        await queryRunner.query(`DROP TABLE "temporary_battle_log"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"))`);
        await queryRunner.query(`INSERT INTO "user"("telegram_id", "player_tag", "admin") SELECT "telegram_id", "player_tag", "admin" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }

}
