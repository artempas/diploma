import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {MessageData, SenderType} from '../types/message';
import {Chat} from './Chat';

/**
 * @openapi
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the message
 *         text:
 *           type: string
 *           nullable: true
 *           description: The text content of the message
 *         message_data:
 *           type: object
 *           nullable: true
 *           description: Additional data for the message
 *         sender:
 *           type: string
 *           enum:
 *             - 'user'
 *             - 'bot'
 *           description: The sender type of the message
 *         chat:
 *           $ref: '#/components/schemas/Chat'
 *           description: The chat associated with the message
 */
@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
        id: string;

    @Column('text', {nullable: true})
        text?: string;

    @Column('json', {nullable: true})
        message_data?: MessageData;

    @Column('varchar', {length: 4})
        sender: SenderType;

    @ManyToOne(() => Chat, (c) => c.messages, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
        chat: Chat;
}