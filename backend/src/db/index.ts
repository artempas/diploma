import {Users} from './Users';
import {DataSource} from 'typeorm';
import {AppDataSource} from '../datasource';

class Db {
    Users: Users;

    constructor (ds: DataSource) {
        this.Users = new Users(ds);
    }
}
const db = new Db(AppDataSource);
export default db;
