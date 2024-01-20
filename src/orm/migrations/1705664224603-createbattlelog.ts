import { MigrationInterface, QueryRunner } from "typeorm";

export class Createbattlelog1705664224603 implements MigrationInterface {
    name = 'Createbattlelog1705664224603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "battle_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "battleTime" time NOT NULL, "trophyChange" integer NOT NULL, "userTelegramId" integer, CONSTRAINT "FK_e6edc5918d8d5d3a1c440cf1fe4" FOREIGN KEY ("userTelegramId") REFERENCES "user" ("telegram_id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("telegram_id", "player_tag", "admin") SELECT "telegram_id", "player_tag", "admin" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("telegram_id", "player_tag", "admin") SELECT "telegram_id", "player_tag", "admin" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "battle_log"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"))`);
        await queryRunner.query(`INSERT INTO "user"("telegram_id", "player_tag", "admin") SELECT "telegram_id", "player_tag", "admin" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"))`);
        await queryRunner.query(`INSERT INTO "user"("telegram_id", "player_tag", "admin") SELECT "telegram_id", "player_tag", "admin" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }

}
