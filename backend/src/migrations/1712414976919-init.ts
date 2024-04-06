import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1712414976919 implements MigrationInterface {
    name = 'Init1712414976919';

    public async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "platform_id" integer NOT NULL,
            "text" text,
            "message_data" json,
            "sender" character varying(4) NOT NULL,
            "chatId" integer,
            CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))
        `);
        await queryRunner.query(`CREATE TABLE "chat" (
            "id" SERIAL NOT NULL,
            "platform_id" integer NOT NULL,
            "variables" jsonb NOT NULL,
            "system_data" jsonb NOT NULL,
            "connectorId" integer,
            CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))
        `);
        await queryRunner.query(`CREATE TABLE "connector" (
            "id" SERIAL NOT NULL,
            "token" text NOT NULL,
            "platform" character varying(20) NOT NULL,
            "scenarioId" integer,
            CONSTRAINT "PK_6c5a19153f8f3074f2836a2b082" PRIMARY KEY ("id"))
        `);
        await queryRunner.query(`CREATE TABLE "scenario" (
            "id" SERIAL NOT NULL,
            "name" character varying(255) NOT NULL,
            "visual_data" text NOT NULL,
            "logical_data" jsonb NOT NULL,
            "created_at" date NOT NULL DEFAULT 'NOW()',
            "userId" uuid,
            CONSTRAINT "PK_ec7b57ee913fb77bb70ed3bc708" PRIMARY KEY ("id"))
        `);
        await queryRunner.query(`CREATE TABLE "user" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "username" character varying(255) NOT NULL,
            "password" character varying(60) NOT NULL,
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))
        `);
        await queryRunner.query('ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE');
        await queryRunner.query('ALTER TABLE "chat" ADD CONSTRAINT "FK_6a9ff7a5eda69c4beef99f71d97" FOREIGN KEY ("connectorId") REFERENCES "connector"("id") ON DELETE CASCADE ON UPDATE CASCADE');
        await queryRunner.query('ALTER TABLE "connector" ADD CONSTRAINT "FK_67af9bbdd9724a33e19a850bc54" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE');
        await queryRunner.query('ALTER TABLE "scenario" ADD CONSTRAINT "FK_09ffbd65c9433635ecf14414ac8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE');
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "scenario" DROP CONSTRAINT "FK_09ffbd65c9433635ecf14414ac8"');
        await queryRunner.query('ALTER TABLE "connector" DROP CONSTRAINT "FK_67af9bbdd9724a33e19a850bc54"');
        await queryRunner.query('ALTER TABLE "chat" DROP CONSTRAINT "FK_6a9ff7a5eda69c4beef99f71d97"');
        await queryRunner.query('ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"');
        await queryRunner.query('DROP TABLE "user"');
        await queryRunner.query('DROP TABLE "scenario"');
        await queryRunner.query('DROP TABLE "connector"');
        await queryRunner.query('DROP TABLE "chat"');
        await queryRunner.query('DROP TABLE "message"');
    }

}
