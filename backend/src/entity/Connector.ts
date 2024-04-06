import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Platforms} from '../types/common';
import {Scenario} from './Scenario';
import {Chat} from './Chat';


@Entity()
export class Connector{
    @PrimaryGeneratedColumn()
        id: number;

    @Column('text')
        token: string;

    @Column('varchar', {length: 20})
        platform: Platforms;

    @ManyToOne(() => Scenario, (s) => s.connectors, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
        scenario: Scenario;

    @OneToMany(() => Chat, (c) => c.id)
        chats: Chat[];
}