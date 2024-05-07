import {Users} from './Users';
import {DataSource} from 'typeorm';
import {AppDataSource} from '../datasource';
import {Scenarios} from './Scenarios';
import {Connectors} from './Connectors';
import {Messages} from './Messages';
import {Chats} from './Chats';

export class Db {
    Users: Users;

    Connectors: Connectors;

    Scenarios: Scenarios;

    Messages: Messages;

    Chats: Chats;

    constructor (ds: DataSource) {
        this.Users = new Users(ds);
        this.Scenarios = new Scenarios(ds);
        this.Connectors = new Connectors(ds);
        this.Messages = new Messages(ds);
        this.Chats = new Chats(ds);
    }
}
const db = new Db(AppDataSource);
export default db;
