import {DataSource, FindOptionsWhere} from 'typeorm';
import {User} from '../entity/User';

export class Users{
    datasource: DataSource;

    constructor (ds: DataSource) {
        this.datasource = ds;
    }

    async findUser (filter: FindOptionsWhere<User>): Promise<User|undefined>{
        return await this.datasource.manager.findOneBy(User, filter) ?? undefined;
    }

    async createUser (data: Partial<User>): Promise<User>{
        const user = await this.datasource.manager.create(User, data);
        return await this.datasource.manager.save(User, user);
    }
}