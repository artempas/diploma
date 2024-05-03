import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConnectorData1714673343334 implements MigrationInterface {
    name = 'AddConnectorData1714673343334';

    public async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "connector" add "data" json');
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "connector" DROP COLUMN "data"');
    }

}
