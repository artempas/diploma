/* eslint-disable @typescript-eslint/no-unused-vars */
import { Adapter, AdapterMessage } from '../../src/adapter/types';
import { Connector } from '../../src/entity/Connector';

export class FakeAdapter implements Adapter{
    messages: AdapterMessage[] = [];

    async handleWebhook (_: Connector, __: Record<any, any>): Promise<AdapterMessage> {
        throw new Error('Method not implemented.');
    }

    sendMessage (message: AdapterMessage): Promise<AdapterMessage> {
        this.messages.push(message);
        return Promise.resolve(message);
    }

    initConnector (connector: Connector): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

}