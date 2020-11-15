import {MigrationInterface, QueryRunner} from "typeorm";

export class init1605461648783 implements MigrationInterface {
    name = 'init1605461648783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Token" ("id" character varying NOT NULL, "token" character varying NOT NULL, "device" character varying NOT NULL, "refreshToken" character varying NOT NULL, "userId" character varying, CONSTRAINT "UQ_047faa403ac47fdb58f3291beab" UNIQUE ("device"), CONSTRAINT "PK_206d2a22c0a6839d849fb7016b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Tag" ("id" character varying NOT NULL, "name" character varying NOT NULL, "userId" character varying, CONSTRAINT "PK_00bd1ec314f664289873394731a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "otherName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Token" ADD CONSTRAINT "FK_662d4382153fd190df048bf0f61" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Tag" ADD CONSTRAINT "FK_a3e5b4bbbeea2cdfb8b2772551a" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tag" DROP CONSTRAINT "FK_a3e5b4bbbeea2cdfb8b2772551a"`);
        await queryRunner.query(`ALTER TABLE "Token" DROP CONSTRAINT "FK_662d4382153fd190df048bf0f61"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "Tag"`);
        await queryRunner.query(`DROP TABLE "Token"`);
    }

}
