import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Platforms} from '../types/common';
import {Scenario} from './Scenario';
import {Chat} from './Chat';

/**
 * @openapi
 * components:
 *   schemas:
 *     Connector:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: The unique identifier for the connector
 *         token:
 *           type: string
 *           description: The token for the connector
 *         platform:
 *           type: string
 *           enum:
 *             - 'vk'
 *             - 'telegram'
 *           description: The platform for the connector
 *         scenario:
 *           $ref: '#/components/schemas/Scenario'
 *           description: The scenario associated with the connector
 *         chats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Chat'
 *           description: List of chats associated with the connector
 */
@Entity()
export class Connector{
    @PrimaryGeneratedColumn()
        id: number;

    @Column('text')
        token: string;

    @Column('varchar', {length: 20})
        platform: Platforms;

    @Column('jsonb', {nullable: true})
        data?: Record<any, any>;


    @ManyToOne(() => Scenario, (s) => s.connectors, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
        scenario: Scenario;

    @OneToMany(() => Chat, (c) => c.connector)
        chats: Chat[];
}