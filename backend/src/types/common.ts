import {User} from '../entity/User';

export enum Platforms {
    vk='vk',
    telegram='telegram'
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express{
        interface Request {
            user?: User
        }
    }
}