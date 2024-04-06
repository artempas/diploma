import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {MessageData, SenderType} from '../types/message';
import {Chat} from './Chat';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
        id: string;

    @Column('int')
        platform_id: number;

    @Column('text', {nullable: true})
        text?: string;

    @Column('json', {nullable: true})
        message_data?: MessageData;

    @Column('varchar', {length: 4})
        sender: SenderType;

    @ManyToOne(() => Chat, (c) => c.messages)
        chat: Chat;
}