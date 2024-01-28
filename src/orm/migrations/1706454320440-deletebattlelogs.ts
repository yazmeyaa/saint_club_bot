import { MigrationInterface, QueryRunner } from "typeorm";

export class Deletebattlelogs1706454320440 implements MigrationInterface {
    name = 'Deletebattlelogs1706454320440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), "trophiesId" integer, "mystery_points" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"), CONSTRAINT "UQ_6753067be967eb35db323425fe5" UNIQUE ("trophiesId"), CONSTRAINT "FK_a468898bd823b414a0d128daa54" FOREIGN KEY ("trophiesId") REFERENCES "user_trophies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("telegram_id", "player_tag", "admin", "trophiesId", "mystery_points") SELECT "telegram_id", "player_tag", "admin", "trophiesId", "mystery_points" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), "trophiesId" integer, "mystery_points" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"), CONSTRAINT "UQ_6753067be967eb35db323425fe5" UNIQUE ("trophiesId"), CONSTRAINT "FK_a468898bd823b414a0d128daa54" FOREIGN KEY ("trophiesId") REFERENCES "user_trophies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("telegram_id", "player_tag", "admin", "trophiesId", "mystery_points") SELECT "telegram_id", "player_tag", "admin", "trophiesId", "mystery_points" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), "trophiesId" integer, "mystery_points" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"), CONSTRAINT "UQ_6753067be967eb35db323425fe5" UNIQUE ("trophiesId"), CONSTRAINT "FK_a468898bd823b414a0d128daa54" FOREIGN KEY ("trophiesId") REFERENCES "user_trophies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "user"("telegram_id", "player_tag", "admin", "trophiesId", "mystery_points") SELECT "telegram_id", "player_tag", "admin", "trophiesId", "mystery_points" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("telegram_id" integer PRIMARY KEY NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT (0), "trophiesId" integer, "mystery_points" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_c1ed111fba8a34b812d11f42352" UNIQUE ("telegram_id"), CONSTRAINT "UQ_6753067be967eb35db323425fe5" UNIQUE ("trophiesId"), CONSTRAINT "FK_a468898bd823b414a0d128daa54" FOREIGN KEY ("trophiesId") REFERENCES "user_trophies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "user"("telegram_id", "player_tag", "admin", "trophiesId", "mystery_points") SELECT "telegram_id", "player_tag", "admin", "trophiesId", "mystery_points" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }

}
