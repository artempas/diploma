import Bottleneck from 'bottleneck';
import {Adapter, AdapterMessage, TelegramWebhook} from './types';
import {Connector} from '../entity/Connector';
import Telegram from './Telegram';
import {Platforms} from '../types/common';


export default class LimitedAdapter implements Adapter{
    private TelegramGroup = new Bottleneck.Group({
        reservoir: 30,
        reservoirRefreshAmount: 30,
        reservoirRefreshInterval: 1100, // a bit bigger to not hit limit
    });

    private TelegramAdapter = new Telegram();

    public afterMessageSent: ((message: AdapterMessage)=> Promise<any>)[] = [];

    public afterMessageReceived: ((message: AdapterMessage)=> Promise<any>)[] = [];

    private static instance: LimitedAdapter;

    private constructor () {
        this.TelegramGroup.on('failed', async (error: any, jobInfo: Bottleneck.EventInfoRetryable) => {
            if (error.name === 'RateLimitError') {
                const id = jobInfo.options.id;
                console.warn(`Job ${id} hit rate limit: ${error}`);
                if (jobInfo.retryCount < 3) { // Here we only retry once
                    console.debug(`Retrying after ${error.retry_after} sec...`);
                    return error.retry_after * 1000;
                } else {
                    console.error(`Unable to execute job. Exceeded retryCount ${JSON.stringify(jobInfo)}`);
                }
            } else {
                console.error(error);
            }
        });
    }

    public static getInstance (){ // singleton
        if (!this.instance) this.instance = new LimitedAdapter();
        return this.instance;
    }

    public async sendMessage (message: AdapterMessage): Promise<AdapterMessage>{
        const connector = await message.chat.connector;
        switch (connector.platform){
        case Platforms.telegram: {
            const result = await this.TelegramGroup.key(connector.id.toString()).schedule(
                () => this.TelegramAdapter.sendMessage(message)
            );
            const promises = this.afterMessageSent.map((i) => i(result));
            await Promise.all(promises);
            return result;
        } default:
            throw new Error('NotImplemented!');
        }

    }

    async handleWebhook (connector: Connector, webhook: Record<any, any>): Promise<AdapterMessage> {
        let result;
        switch (connector.platform){
        case Platforms.telegram: {
            result = await this.TelegramAdapter.handleWebhook(connector, webhook as TelegramWebhook);
            break;
        }
        default: throw new Error('NotImplemented');
        }
        const promises = this.afterMessageReceived.map((i) => i(result));
        await Promise.all(promises);
        return result;
    }

    async initConnector (connector: Connector): Promise<boolean> {
        console.log('Initializing connector');
        switch (connector.platform){
        case Platforms.telegram: {
            return await this.TelegramGroup.key(connector.id.toString()).schedule(
                () => this.TelegramAdapter.initConnector(connector)
            );
        }
        default: throw new Error('NotImplemented');

        }
    }
}