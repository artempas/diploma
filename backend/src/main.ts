import express from 'express';
import { decrypt } from '@tka85/dotenvenc';


const server = express();
decrypt();

server.use(express.json());

server.get('/', (req, res) => {
    res.json({hello: 'world'});
});

server.listen(3000);