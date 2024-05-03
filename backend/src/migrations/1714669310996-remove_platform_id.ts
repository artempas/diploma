import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePlatformId1714669310996 implements MigrationInterface {
    name = 'RemovePlatformId1714669310996';

    public async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "message" DROP COLUMN "platform_id"');
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "message" ADD column "platform_id" integer NOT NULL');
    }

}
