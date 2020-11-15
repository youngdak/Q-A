import {MigrationInterface, QueryRunner} from "typeorm";

export class adjustedColumns1605461938781 implements MigrationInterface {
    name = 'adjustedColumns1605461938781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Token" DROP CONSTRAINT "FK_662d4382153fd190df048bf0f61"`);
        await queryRunner.query(`ALTER TABLE "Token" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "Token"."userId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "Tag" DROP CONSTRAINT "FK_a3e5b4bbbeea2cdfb8b2772551a"`);
        await queryRunner.query(`ALTER TABLE "Tag" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "Tag"."userId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "User" ALTER COLUMN "otherName" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "User"."otherName" IS NULL`);
        await queryRunner.query(`ALTER TABLE "Token" ADD CONSTRAINT "FK_662d4382153fd190df048bf0f61" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Tag" ADD CONSTRAINT "FK_a3e5b4bbbeea2cdfb8b2772551a" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tag" DROP CONSTRAINT "FK_a3e5b4bbbeea2cdfb8b2772551a"`);
        await queryRunner.query(`ALTER TABLE "Token" DROP CONSTRAINT "FK_662d4382153fd190df048bf0f61"`);
        await queryRunner.query(`COMMENT ON COLUMN "User"."otherName" IS NULL`);
        await queryRunner.query(`ALTER TABLE "User" ALTER COLUMN "otherName" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "Tag"."userId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "Tag" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Tag" ADD CONSTRAINT "FK_a3e5b4bbbeea2cdfb8b2772551a" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "Token"."userId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "Token" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Token" ADD CONSTRAINT "FK_662d4382153fd190df048bf0f61" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
