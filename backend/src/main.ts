import express from 'express';
import { decrypt } from '@tka85/dotenvenc';
import swaggerRouter from './swagger';
import usersRouter from './methods/auth';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import scenariosRouter from './methods/scenarios';

decrypt();
const server = express();
server.use(cors({
    origin: process.env.FRONT_URL
}));

server.use(cookieParser());
server.use(express.json());

server.use('/swagger', swaggerRouter);
server.use('/users', usersRouter);
server.use('/scenario', scenariosRouter);
server.get('/', (req, res) => {
    res.json({hello: 'world'});
});


server.listen(3000, () => console.log('HTTP started'));