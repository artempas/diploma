import {DataSource, FindOptionsWhere} from 'typeorm';
import {Scenario} from '../entity/Scenario';

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
}