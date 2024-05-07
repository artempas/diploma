import {
    Adapter,
    AdapterMessage,
    RateLimitError,
    TelegramSendMessage,
    TelegramWebhook,
    UnsupportedMessageError
} from './types';
import fetch from 'node-fetch';
import {Connector} from '../entity/Connector';
import {createHash} from 'crypto';
import { Db } from '../db';

export default class Telegram implements Adapter {
    db: Db;

    constructor (db: Db){
        this.db = db;
    }

    async handleWebhook (connector: Connector, webhook: TelegramWebhook): Promise<AdapterMessage> {
        if (webhook.message){
            const chat = await this.db.Chats.assertChat({
                platform_id: webhook.message.chat.id,
                first_name: webhook.message.chat.first_name,
                last_name: webhook.message.chat.last_name,
                username: webhook.message.chat.username
            }, connector);
            return {
                text: webhook.message.text ?? '',
                chat
            };
        } else {
            throw new UnsupportedMessageError();
        }
    }

    async initConnector (connector: Connector): Promise<boolean> {
        const getMe = this.makeRequest(connector, 'getMe', {}).then(async (me) => {
            if (!me.ok) throw new Error('Not able to get ME');
            connector.data = me.result;
            await this.db.Connectors.updateConnector(connector);
        });
        const secret_token = await createHash('md5').update(connector.token).digest('hex');
        console.log(secret_token);
        const response = await this.makeRequest(connector, 'setWebhook', {
            url: `${process.env.WEBHOOK_URL}/adapter/${connector.id}`,
            secret_token: secret_token
        });
        await getMe;
        if (response.ok){
            return true;
        } else {
            throw new Error(`Request to telegram API failed: ${JSON.stringify(response)}`);
        }
    }

    async sendMessage (message: AdapterMessage): Promise<AdapterMessage> {
        const body: TelegramSendMessage = {
            text: message.text,
            chat_id: message.chat.platform_id
        };
        if (message.buttons){
            body.reply_markup = {
                keyboard: [message.buttons],
                input_field_placeholder: 'Отвечайте только кнопками',
                is_persistent: true,
                one_time_keyboard: true,
                resize: true
            };
        }
        const res = await this.makeRequest(await message.chat.connector, 'sendMessage', body);
        if (!res.ok) throw new Error(`Unable to send message ${JSON.stringify(message)}.\nResponse:${JSON.stringify(res)}`);
        console.log(res);
        return {
            text: res.result.text,
            chat: message.chat,
            buttons: message.buttons
        };
    }

    private async makeRequest (connector: Connector, method: string, data: Record<any, any>): Promise<Record<any, any>>{
        console.log(`Making request to telegram. URL: https://api.telegram.org/bot${connector.token}/${method}
        BODY: ${JSON.stringify(data)}`);
        const response = await (await fetch(`https://api.telegram.org/bot${connector.token}/${method}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json'
            }
        })).json();
        console.log(response);
        if (!response.ok && response.error_code === 429){
            throw new RateLimitError(response.parameters.retry_after);
        }
        return response;
    }
}