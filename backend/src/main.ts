import express from 'express';
import { decrypt } from '@tka85/dotenvenc';
import swaggerRouter from './swagger';
import usersRouter from './methods/auth';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import scenariosRouter from './methods/scenarios';
import {init_adapter} from './adapter';
import adapterRouter from './adapter/httpHandler';
import statusMonitor from 'express-status-monitor';

decrypt();
const server = express();
server.use(statusMonitor({
    title: 'Diploma status',
    healthChecks:[
        {
            protocol: 'http',
            host: 'localhost',
            port: '8080',
            path: '/'
        },
        {
            protocol: 'http',
            host: 'localhost',
            port: '3000',
            path: '/'
        },
    ]
}));
server.use(cors({
    origin: process.env.FRONT_URL
}));
init_adapter();

server.use(cookieParser());
server.use(express.json());
server.use('/adapter', adapterRouter);
server.use('/swagger', swaggerRouter);
server.use('/users', usersRouter);
server.use('/scenario', scenariosRouter);
server.get('/', (req, res) => {
    res.json({hello: 'world'});
});


server.listen(3000, () => console.log('HTTP started'));