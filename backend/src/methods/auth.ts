import express, {RequestHandler} from 'express';
import Db from '../db';
import {sign, verify} from 'jsonwebtoken';
import {compare, genSalt, hash} from 'bcrypt';
import db from '../db';
const usersRouter = express.Router();

usersRouter.post('/auth', login);
usersRouter.post('/register', register);

const AUTH_COOKIE_NAME = 'Auth';

/**
 * @openapi
 * /users/auth:
 *     post:
 *       summary: Authenticate user
 *       tags:
 *         - users
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   ok:
 *                     type: boolean
 *                   token:
 *                     type: string
 *           headers:
 *             Set-Cookie:
 *               schema:
 *                 type: string
 *                 example: Auth=abcde12345;
 *         '400':
 *           description: Bad request
 *         '403':
 *           description: Forbidden
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   ok:
 *                     type: boolean
 *                   error:
 *                     type: string
 *         '404':
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   ok:
 *                     type: boolean
 *                   error:
 *                     type: string
 */
async function login (
    req: express.Request,
    res: express.Response
){
    const {username, password} = req.body;
    if (!username || !password){
        return res.json({ok: false, err: 'Some required params are missing'}).status(400);
    }
    const user = await Db.Users.findUser({ username }, true);
    if (!user){
        return res.json({ok: false, error: 'User not found'}).status(404);
    }
    if (!await compare(password, user.password)){
        return res.json({ok: false, error: 'Wrong password'}).status(403);
    }
    const token = sign(user.id, process.env.ACCESS_TOKEN_SECRET!);
    res.header({'Set-cookie': `Auth:${token}`});
    return res.json({ok: true, token});
}

/**
 * @openapi
 *   /users/register:
 *     post:
 *       tags:
 *         - users
 *       summary: Register a new user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         '200':
 *           description: User registered successfully
 *           headers:
 *             Set-Cookie:
 *               schema:
 *                 type: string
 *                 example: auth=abcde12345;
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '400':
 *           description: Invalid request body
 *         '409':
 *           description: Username already taken
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   ok:
 *                     type: boolean
 *                     value: false
 *                   err:
 *                     type: string
 *                     description: Username already taken
 */
async function register (req: express.Request<{username: string, password: string}>, res: express.Response){
    const {username, password} = req.body;
    if (!username || !password){
        return res.status(400);
    }
    if (await Db.Users.findUser({ username })){
        return res.json({ok: false, err: 'Username already taken'});
    }
    const salt = await genSalt(10);
    const hashed_password = await hash(password, salt);
    const user = await Db.Users.createUser({username, password: hashed_password});
    const token = sign(user.id, process.env.ACCESS_TOKEN_SECRET!);
    res.header({'Set-cookie': `${AUTH_COOKIE_NAME}:${token}`});

    return res.json({id: user.id, username: user.username, token});
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
    const token = req.cookies[AUTH_COOKIE_NAME] ?? req.header(AUTH_COOKIE_NAME);
    if (token){
        const id = verify(token, process.env.ACCESS_TOKEN_SECRET!).toString();
        const user = await db.Users.findUser({ id });
        if (user) {
            req.user = user;
            return next();
        }
    }
    res.sendStatus(403);
};

export default usersRouter;