import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Element} from '../types/scenario';
import {User} from './User';
import {Connector} from './Connector';

/**
 * @openapi
 * components:
 *   schemas:
 *     Scenario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: The unique identifier for the scenario
 *         name:
 *           type: string
 *           maxLength: 255
 *           description: The name of the scenario
 *         visual_data:
 *           type: string
 *           description: Visual data for the scenario
 *         logical_data:
 *           type: array
 *           items:
 *             type: object
 *           description: Logical data elements for the scenario
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date and time when the scenario was created
 *         user:
 *           $ref: '#/components/schemas/User'
 *           description: The user associated with the scenario
 *         connectors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Connector'
 *           description: List of connectors associated with the scenario
 */
@Entity()
export class Scenario {
    @PrimaryGeneratedColumn()
        id: number;

    @Column('varchar', {length: 255})
        name: string;

    @Column('text', {nullable: true})
        visual_data?: string;

    @Column('jsonb', {nullable: true})
        logical_data?: Element<any>[];

    @Column('date', {default: 'NOW()'})
        created_at: string;

    @ManyToOne(() => User, (user) => user.scenarios, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
        user: User;

    @OneToMany(() => Connector, (con) => con.scenario)
        connectors: Connector[];
}