import {Users} from './Users';
import {DataSource} from 'typeorm';
import {AppDataSource} from '../datasource';
import {Scenarios} from './Scenarios';
import {Connectors} from './Connectors';

class Db {
    Users: Users;

    Connectors: Connectors;

    Scenarios: Scenarios;

    constructor (ds: DataSource) {
        this.Users = new Users(ds);
        this.Scenarios = new Scenarios(ds);
        this.Connectors = new Connectors(ds);
    }
}
const db = new Db(AppDataSource);
export default db;
