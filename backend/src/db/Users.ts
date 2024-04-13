import {DataSource, FindOptionsWhere} from 'typeorm';
import {User} from '../entity/User';

export class Users{
    private dataSource: DataSource;

    constructor (ds: DataSource) {
        this.dataSource = ds;
    }

    async findUser (filter: FindOptionsWhere<User>, return_password?: boolean): Promise<User|undefined>{
        return await this.dataSource.manager.findOne(User, {
            where: filter,
            select: {
                password: return_password ?? false,
                username: true,
                id: true
            }
        }) ?? undefined;
    }

    async createUser (data: Partial<User>): Promise<User>{
        const user = await this.dataSource.manager.create(User, data);
        return await this.dataSource.manager.save(User, user);
    }
}