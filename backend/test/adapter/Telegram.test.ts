import Telegram from '../../src/adapter/Telegram';
import { TelegramWebhook, AdapterMessage } from '../../src/adapter/types';
import { TestDataSource } from '../../src/datasource';
import { Db } from '../../src/db';
import { Connector } from '../../src/entity/Connector';
import { Platforms } from '../../src/types/common';

describe('Telegram Adapter', () => {
    let telegram: Telegram;
    let connector: Connector;
    let webhook: TelegramWebhook;
    let message: AdapterMessage;

    beforeEach(async () => {
        process.env.WEBHOOK_URL='https://example.com';
        await TestDataSource.initialize();
        const db = new Db(TestDataSource);
        telegram = new Telegram(db);
        const user = await db.Users.createUser({
            username: 'test',
            password: 'test'
        });
        const scenario = await db.Scenarios.createScenario('Test', user);
        connector = await db.Connectors.createConnector({
            token: '7191061863:AAGwnQXtRX1xXhWsWen78W3KiKjVnK4r6os',
            platform: Platforms.telegram,
            scenario
        });
        webhook = {
            update_id: 1,
            message: {
                message_id: 1,
                date: 1,
                chat: {
                    id: 1,
                    first_name: 'John',
                    last_name: 'Doe',
                    username: 'johndoe'
                },
                text: 'Hello, World!',
            }
        };
        // @ts-ignore
        message = {
            text: 'Hello, World!',
            chat: {
                id: 1,
                platform_id: 354640082,
                connector,
                variables: {},
                system_data: {position: 'init'},
                messages: []
            }
        };
    });
    afterEach(async () => {
        await TestDataSource.destroy();
    });

    it('should handle webhook and return AdapterMessage', async () => {
        const result = await telegram.handleWebhook(connector, webhook);
        expect(result.text).toBe('Hello, World!');
        expect(result.chat.platform_id).toBe(webhook.message?.chat.id);
    });

    it('should initialize connector and return true', async () => {
        const result = await telegram.initConnector(connector);
        const webhook_url = await (await fetch(`https://api.telegram.org/bot${connector.token}/getWebhookInfo`)).json();
        expect(webhook_url.result.url).toBe(`${process.env.WEBHOOK_URL}/adapter/${connector.id}`);
        expect(result).toBe(true);
    }, 30000);

    it('should send message and return AdapterMessage', async () => {
        const result = await telegram.sendMessage(message);
        expect(result.text).toBe('Hello, World!');
        expect(result.chat.platform_id).toBeDefined();
    }, 30000);
});
