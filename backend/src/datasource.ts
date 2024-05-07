import {User} from './entity/User';
import {Scenario} from './entity/Scenario';
import {Connector} from './entity/Connector';
import {Chat} from './entity/Chat';
import {Message} from './entity/Message';
import {DataSource} from 'typeorm';
import {configDotenv} from 'dotenv';
configDotenv();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_DATA!,
    synchronize: true,
    // logging: true,
    entities: [
        User,
        Scenario,
        Connector,
        Chat,
        Message
    ],
    subscribers: [],
    migrations: [
        'src/migrations/*.ts'
    ],
});

export const TestDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    entities: [
        User,
        Scenario,
        Connector,
        Chat,
        Message
    ],
    migrations: [
        'src/migrations/*.ts'
    ],
});
if (process.env.NODE_ENV !== 'test') {
    AppDataSource.initialize().then((_) => console.log('Connected to DB'));
}