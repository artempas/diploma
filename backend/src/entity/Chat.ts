import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {SystemData} from '../types/chat';
import {Connector} from './Connector';
import {Message} from './Message';

@Entity()
export class Chat{
    @PrimaryGeneratedColumn()
        id: number;

    @Column('int')
        platform_id: number;

    @Column('jsonb')
        variables?: Record<any, any>;

    @Column('jsonb')
        system_data?: SystemData;

    @ManyToOne(() => Connector, (c) => c.chats, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
        connector: Connector;

    @OneToMany(() => Message, (m) => m.id)
        messages: Message;
}