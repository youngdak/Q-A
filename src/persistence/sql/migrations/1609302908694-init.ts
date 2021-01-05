import {MigrationInterface, QueryRunner} from "typeorm";

export class init1609302908694 implements MigrationInterface {
    name = 'init1609302908694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Tag" ("id" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdBy" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_00bd1ec314f664289873394731a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "otherName" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdBy" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UserTag" ("id" character varying NOT NULL, "createdBy" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL, "userId" character varying NOT NULL, "tagId" character varying NOT NULL, CONSTRAINT "PK_7cfdf7654b5be4d7c7ef217c9de" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "UserTag"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "Tag"`);
    }

}
