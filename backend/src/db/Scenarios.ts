import {DataSource, FindOptionsWhere} from 'typeorm';
import {Scenario} from '../entity/Scenario';
import {User} from '../entity/User';

export class Scenarios{
    private dataSource: DataSource;

    constructor (ds: DataSource) {
        this.dataSource = ds;
    }

    async findScenario (options: FindOptionsWhere<Scenario>): Promise<Scenario|null>{
        return await this.dataSource.manager.findOne(Scenario, {where: {...options}, relations: {connectors: true}});
    }

    async findScenarios (options: FindOptionsWhere<Scenario>): Promise<Scenario[]>{
        return await this.dataSource.manager.findBy(Scenario, options);
    }

    async createScenario (name: string, user: User){
        const scenario = this.dataSource.manager.create(Scenario, {
            name,
            user
        });
        return await this.dataSource.manager.save(scenario);
    }

    async updateScenario (id: number, user: User, visual_data: any): Promise<number>{
        return (await this.dataSource.manager.update(
            Scenario,
            {id, user},
            {visual_data: JSON.stringify(visual_data)}
        )).affected ?? 0;
    }

    async deleteScenario (id: number, user: User): Promise<number>{
        return (await this.dataSource.manager.delete(Scenario, {
            id, user
        })).affected ?? 0;
    }
}