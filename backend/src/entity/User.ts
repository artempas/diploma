import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Scenario} from './Scenario';


/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the user
 *         username:
 *           type: string
 *           maxLength: 255
 *           description: The username for the user
 *         scenarios:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Scenario'
 *           description: List of scenarios associated with the user
 */
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
        id: string;

    @Column('varchar', { length: 255 })
        username: string;

    @Column('varchar', { length: 60, select: false })
        password: string;

    @OneToMany(() => Scenario, (scenario) => scenario.user)
        scenarios: Scenario[];
}