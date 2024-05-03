import {DataSource, FindOptionsWhere} from 'typeorm';
import {Connector} from '../entity/Connector';

export class Connectors{
    private dataSource: DataSource;

    constructor (ds: DataSource) {
        this.dataSource = ds;
    }

    async updateConnector (connector: Connector): Promise<Connector>{
        return await this.dataSource.manager.save(connector);
    }

    async findConnectors (filter: FindOptionsWhere<Connector>): Promise<Connector[]>{
        return await this.dataSource.manager.find(Connector, {
            where: filter,
        });
    }

    async createConnector (data: Partial<Connector>): Promise<Connector>{
        const connector = await this.dataSource.manager.create(Connector, data);
        return await this.dataSource.manager.save(Connector, connector);
    }

    async deleteConnector (data: FindOptionsWhere<Connector>): Promise<number>{
        const deleted = await this.dataSource.manager.delete(Connector, data);
        return deleted.affected ?? 0;
    }
}