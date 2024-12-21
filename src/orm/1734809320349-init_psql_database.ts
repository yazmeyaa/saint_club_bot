import { MigrationInterface, QueryRunner } from "typeorm";

export class InitPsqlDatabase1734809320349 implements MigrationInterface {
    name = 'InitPsqlDatabase1734809320349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_trophies" ("id" SERIAL NOT NULL, "day" integer NOT NULL DEFAULT '0', "week" integer NOT NULL DEFAULT '0', "month" integer NOT NULL DEFAULT '0', "usertelegramid" integer, CONSTRAINT "REL_f61db1b6af8f7f9691ce776c32" UNIQUE ("usertelegramid"), CONSTRAINT "PK_06ec2b60befce8d3a467b739b50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("telegram_id" integer NOT NULL, "player_tag" text, "admin" boolean NOT NULL DEFAULT false, "mystery_points" integer NOT NULL DEFAULT '0', "trophiesid" integer, CONSTRAINT "REL_a468898bd823b414a0d128daa5" UNIQUE ("trophiesid"), CONSTRAINT "PK_c1ed111fba8a34b812d11f42352" PRIMARY KEY ("telegram_id"))`);
        await queryRunner.query(`CREATE TABLE "trophies_record" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "playertag" text NOT NULL, "trophies" integer NOT NULL, CONSTRAINT "PK_d04210e6bb9fc2d7168931f0967" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_title" ("id" SERIAL NOT NULL, "pointsneed" integer NOT NULL, "title" text NOT NULL, CONSTRAINT "UQ_b8c8970b25ad896ecf27b9283c2" UNIQUE ("pointsneed"), CONSTRAINT "PK_8ce1e7685e9186d6cf8021903eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_trophies" ADD CONSTRAINT "FK_f61db1b6af8f7f9691ce776c326" FOREIGN KEY ("usertelegramid") REFERENCES "user"("telegram_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a468898bd823b414a0d128daa54" FOREIGN KEY ("trophiesid") REFERENCES "user_trophies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a468898bd823b414a0d128daa54"`);
        await queryRunner.query(`ALTER TABLE "user_trophies" DROP CONSTRAINT "FK_f61db1b6af8f7f9691ce776c326"`);
        await queryRunner.query(`DROP TABLE "user_title"`);
        await queryRunner.query(`DROP TABLE "trophies_record"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_trophies"`);
    }

}
