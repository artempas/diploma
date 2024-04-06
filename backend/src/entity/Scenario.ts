import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Element} from '../types/scenario';
import {User} from './User';
import {Connector} from './Connector';

@Entity()
export class Scenario {
    @PrimaryGeneratedColumn()
        id: number;

    @Column('varchar', {length: 255})
        name: string;

    @Column('text')
        visual_data: string;

    @Column('jsonb')
        logical_data: Element<any>[];

    @Column('date', {default: 'NOW()'})
        created_at: string;

    @ManyToOne(() => User, (user) => user.scenarios, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
        user: User;

    @OneToMany(() => Connector, (con) => con.id)
        connectors: Connector[];
}