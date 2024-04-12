import {Users} from './Users';
import {DataSource} from 'typeorm';
import {AppDataSource} from '../datasource';
import {Scenarios} from './Scenarios';

class Db {
    Users: Users;

    Scenarios: Scenarios;

    constructor (ds: DataSource) {
        this.Users = new Users(ds);
        this.Scenarios = new Scenarios(ds);
    }
}
const db = new Db(AppDataSource);
export default db;
