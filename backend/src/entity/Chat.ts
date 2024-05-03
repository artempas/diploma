import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {SystemData} from '../types/chat';
import {Connector} from './Connector';
import {Message} from './Message';

/**
 * @openapi
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: The unique identifier for the chat
 *         platform_id:
 *           type: integer
 *           description: The platform id for the chat
 *         variables:
 *           type: object
 *           additionalProperties:
 *             type: any
 *           description: Variables associated with the chat
 *         system_data:
 *           type: object
 *           description: System data for the chat
 *         connector:
 *           $ref: '#/components/schemas/Connector'
 *           description: The connector associated with the chat
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *           description: List of messages associated with the chat
 */
@Entity()
export class Chat{
    @PrimaryGeneratedColumn()
        id: number;

    @Column('int')
        platform_id: number;

    @Column('jsonb')
        variables: Record<any, any>;

    @Column('jsonb')
        system_data: SystemData;

    @ManyToOne(() => Connector, (c) => c.chats, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
        connector: Connector;

    @OneToMany(() => Message, (m) => m.chat)
        messages: Message;
}