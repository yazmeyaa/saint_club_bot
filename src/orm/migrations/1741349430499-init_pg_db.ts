import { MigrationInterface, QueryRunner } from "typeorm";

export class InitPgDb1741349430499 implements MigrationInterface {
    name = 'InitPgDb1741349430499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_trophies" ("id" SERIAL NOT NULL, "day" integer NOT NULL DEFAULT '0', "week" integer NOT NULL DEFAULT '0', "month" integer NOT NULL DEFAULT '0', "usertelegramid" bigint, CONSTRAINT "REL_20539758e0cae4adbc4e54aee0" UNIQUE ("usertelegramid"), CONSTRAINT "PK_06ec2b60befce8d3a467b739b50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("telegram_id" bigint NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT false, "mystery_points" integer NOT NULL DEFAULT '0', "trophiesid" integer, CONSTRAINT "REL_bf395a8c44163629c90f646efb" UNIQUE ("trophiesid"), CONSTRAINT "PK_c1ed111fba8a34b812d11f42352" PRIMARY KEY ("telegram_id"))`);
        await queryRunner.query(`CREATE TABLE "trophies_record" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "playertag" text NOT NULL, "trophies" integer NOT NULL, CONSTRAINT "PK_d04210e6bb9fc2d7168931f0967" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_title" ("id" SERIAL NOT NULL, "pointsneed" integer NOT NULL, "title" text NOT NULL, CONSTRAINT "UQ_a28322f51fa9cabe2c833e0b387" UNIQUE ("pointsneed"), CONSTRAINT "PK_8ce1e7685e9186d6cf8021903eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_trophies" ADD CONSTRAINT "FK_20539758e0cae4adbc4e54aee07" FOREIGN KEY ("usertelegramid") REFERENCES "user"("telegram_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_bf395a8c44163629c90f646efbd" FOREIGN KEY ("trophiesid") REFERENCES "user_trophies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_bf395a8c44163629c90f646efbd"`);
        await queryRunner.query(`ALTER TABLE "user_trophies" DROP CONSTRAINT "FK_20539758e0cae4adbc4e54aee07"`);
        await queryRunner.query(`DROP TABLE "user_title"`);
        await queryRunner.query(`DROP TABLE "trophies_record"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_trophies"`);
    }

}
