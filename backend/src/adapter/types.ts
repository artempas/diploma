import {Connector} from '../entity/Connector';
import {Button} from '../types/message';
import {Chat} from '../entity/Chat';
import exp from 'node:constants';

export interface Adapter{
    handleWebhook(connector: Connector, webhook: Record<any, any>): Promise<AdapterMessage>;
    sendMessage(message: AdapterMessage): Promise<AdapterMessage>;
    initConnector(connector: Connector): Promise<boolean>;
}

export type AdapterMessage={
    chat: Chat,
    text: string,
    buttons?: Button[]
}

export class RateLimitError extends Error {
    retry_after: number;

    constructor (retry_after: number) {
        super(`Bot hit rate limit. Retry after ${retry_after}sec`);
        this.name = 'RateLimitError';
        this.retry_after = retry_after;
    }
}

export class UnsupportedMessageError extends Error {
    constructor () {
        super('Received unsupported message');
        this.name = 'UnsupportedMessageError';
    }
}

export type TelegramWebhook={
    update_id: number,
    message?: TelegramMessage
}

export type TelegramMessage={
    message_id: number,
    chat: TelegramChat,
    date: number,
    text?: string,
}

export type TelegramChat={
    id: number,
    first_name?: string,
    last_name?: string,
    username?: string
}

export type TelegramKeyboard={
    is_persistent: true,
    one_time_keyboard: true,
    resize: true,
    input_field_placeholder: 'Отвечайте только кнопками',
    keyboard: {
        text: string
    }[][]
}

export type TelegramSendMessage={
    chat_id: number,
    text: string,
    reply_markup?: TelegramKeyboard
}