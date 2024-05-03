import {DataSource, FindOptionsWhere} from 'typeorm';
import {Connector} from '../entity/Connector';
import {Chat} from '../entity/Chat';
import {Platforms} from '../types/common';

export class Chats{
    private dataSource: DataSource;

    constructor (ds: DataSource) {
        this.dataSource = ds;
    }

    async assertChat (chat: {
        platform_id: number,
        first_name?: string,
        last_name?: string,
        username?: string
    }, connector: Connector): Promise<Chat>{
        let entity = await this.dataSource.manager.findOne(Chat, {
            relations:{
                connector:{
                    scenario:true
                }
            },
            where: {
                platform_id: chat.platform_id,
                connector
            }
        });
        if (!entity){
            entity = this.dataSource.manager.create(Chat, {
                connector: connector,
                platform_id: chat.platform_id,
                system_data: {
                    position: 'init'
                },
                variables: {
                    platform: Platforms[connector.platform],
                    ...chat
                }
            });
            entity = await this.dataSource.manager.save(entity);
        }
        return entity;
    }

    async saveChat (chat: Chat): Promise<Chat>{
        return await this.dataSource.manager.save(chat);
    }
}