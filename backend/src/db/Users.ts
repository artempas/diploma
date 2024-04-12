import {DataSource, FindOptionsWhere} from 'typeorm';
import {User} from '../entity/User';

export class Users{
    private dataSource: DataSource;

    constructor (ds: DataSource) {
        this.dataSource = ds;
    }

    async findUser (filter: FindOptionsWhere<User>): Promise<User|undefined>{
        return await this.dataSource.manager.findOneBy(User, filter) ?? undefined;
    }

    async createUser (data: Partial<User>): Promise<User>{
        const user = await this.dataSource.manager.create(User, data);
        return await this.dataSource.manager.save(User, user);
    }
}