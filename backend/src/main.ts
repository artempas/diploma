import express from 'express';
import { decrypt } from '@tka85/dotenvenc';
import swaggerRouter from './swagger';
import usersRouter from './methods/auth';
import cors from 'cors';

decrypt();
const server = express();
server.use(cors({
    origin: process.env.FRONT_URL
}));

server.use(express.json());

server.use('/swagger', swaggerRouter);
server.use('/users', usersRouter);
server.get('/', (req, res) => {
    res.json({hello: 'world'});
});


server.listen(3000, () => console.log('HTTP started'));