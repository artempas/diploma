import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConnetorToJsonb1714737712022 implements MigrationInterface {
    name = 'ConnetorToJsonb1714737712022';

    public async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "connector" DROP COLUMN "data"');
        await queryRunner.query('ALTER TABLE "connector" ADD "data" jsonb');
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "connector" DROP COLUMN "data"');
        await queryRunner.query('ALTER TABLE "connector" ADD "data" json');
    }

}
