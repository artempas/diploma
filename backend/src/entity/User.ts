import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Scenario} from './Scenario';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
        id: string;

    @Column('varchar', { length: 255 })
        username: string;

    @Column('varchar', { length: 60 })
        password: string;

    @OneToMany(() => Scenario, (scenario) => scenario.id)
        scenarios: Scenario[];
}