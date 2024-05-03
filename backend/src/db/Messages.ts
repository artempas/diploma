import {DataSource} from 'typeorm';
import {AdapterMessage} from '../adapter/types';
import {Message} from '../entity/Message';
import {SenderType} from '../types/message';
import {Chat} from '../entity/Chat';

export class Messages {
    private dataSource: DataSource;

    constructor (ds: DataSource) {
        this.dataSource = ds;
    }

    async saveAdapterMessage (message: AdapterMessage, sender: SenderType){
        const msg = this.dataSource.manager.create(Message, {
            text: message.text,
            chat: message.chat,
            sender,
            message_data: {
                text: message.text,
                buttons: message.buttons
            }
        });
        return await this.dataSource.manager.save(msg);
    }
}