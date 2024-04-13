import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNulls1713001629775 implements MigrationInterface {
    name = 'RemoveNulls1713001629775';

    public async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "scenario" ALTER COLUMN "visual_data" DROP NOT NULL');
        await queryRunner.query('ALTER TABLE "scenario" ALTER COLUMN "logical_data" DROP NOT NULL');
        await queryRunner.query('ALTER TABLE "scenario" ALTER COLUMN "created_at" SET DEFAULT \'NOW()\'');
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "scenario" ALTER COLUMN "created_at" SET DEFAULT \'2024-04-13\'');
        await queryRunner.query('ALTER TABLE "scenario" ALTER COLUMN "logical_data" SET NOT NULL');
        await queryRunner.query('ALTER TABLE "scenario" ALTER COLUMN "visual_data" SET NOT NULL');
    }

}
