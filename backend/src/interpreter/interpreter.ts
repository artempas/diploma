import Bottleneck from 'bottleneck';
import {Adapter, AdapterMessage} from '../adapter/types';
import {ElementType} from '../types/scenario';
import {context_type} from './types';
import LimitedAdapter from '../adapter/limiter';
import db, { Db } from '../db';

export class Interpreter{
    private limiter = new Bottleneck.Group({
        maxConcurrent: 1
    });

    private adapter: Adapter = LimitedAdapter.getInstance();

    private static instance: Interpreter;

    private db: Db = db;

    private constructor () {
    }

    public setAdapter (adapter: Adapter){
        this.adapter = adapter;
    }

    public setDb (db: Db){
        this.db = db;
    }

    public static getInstance (): Interpreter{
        if (!this.instance)
            this.instance = new Interpreter();
        return this.instance;
    }

    async handleMessage (message: AdapterMessage){
        this.limiter.key(message.chat.id.toString()).schedule(async () => {
            await this.handleElement(message);
        });
    }

    private insertVariables (text: string, variables: Record<string, any>): string{
        for (const [variable, value] of Object.entries(variables)){
            text = text.replace(`\${${variable}}`, value);
        }
        return text;
    }

    async handleElement (message: AdapterMessage, execute_single: boolean = false){
        console.log(`Handling Message: ${JSON.stringify(message)}`);
        const scenario = message.chat.connector.scenario;
        const context: context_type<ElementType> = {
            current_element:
                scenario.logical_data[message.chat.system_data?.position ?? 'init']
                ?? scenario.logical_data['init']!,
            chat: message.chat,
            input: message.text
        };
        let execute_next = true;
        while (execute_next){
            // @ts-ignore
            execute_next = await this.elements_map[context.current_element.element_type](context);
            execute_next = execute_single ? false : execute_next;
            context.chat = await db.Chats.saveChat(context.chat);
            context.current_element =
                scenario.logical_data[message.chat.system_data.position ?? 'init']
                ?? scenario.logical_data['init']!;
            delete context.input;
        }
    }

    elements_map: {[elementType in ElementType]: (context: context_type<elementType>)=> Promise<boolean>} = {
        [ElementType.init]: async (context) => {
            await this.adapter.sendMessage({
                chat: context.chat,
                text: this.insertVariables(context.current_element.data.text, context.chat.variables)
            });
            context.chat.system_data.position = context.current_element.data.next;
            return true;
        },
        [ElementType.send_message]: async (context) => {
            await this.adapter.sendMessage({
                chat: context.chat,
                text: this.insertVariables(context.current_element.data.text, context.chat.variables)
            });
            context.chat.system_data.position = context.current_element.data.next;
            return true;
        },
        [ElementType.input]: async (context) => {
            if (context.chat.system_data.on_input){
                context.chat.variables[context.current_element.data.variable] = context.input;
                context.chat.system_data.position = context.current_element.data.next;
                context.chat.system_data.on_input = false;
                return true;
            }
            await this.adapter.sendMessage({
                chat: context.chat,
                text: this.insertVariables(context.current_element.data.message, context.chat.variables)
            });
            context.chat.system_data.on_input = true;
            return false;
        },
        [ElementType.menu]: async (context) => {
            if (
                context.chat.system_data.on_menu
                && context.current_element.data.buttons.filter(
                    (btn) => this.insertVariables(btn.text, context.chat.variables) === context.input
                ).length
            ){
                context.chat.system_data.position
                    = context.current_element.data.buttons.filter(
                        (btn) => this.insertVariables(btn.text, context.chat.variables) === context.input
                    )[0]!.next;
                context.chat.system_data.on_menu = false;
                return true;
            }
            await this.adapter.sendMessage({
                chat: context.chat,
                text: this.insertVariables(context.current_element.data.text, context.chat.variables),
                buttons: context.current_element.data.buttons.map((btn) => ({
                    text: this.insertVariables(btn.text, context.chat.variables)
                }))
            });
            context.chat.system_data.on_menu = true;
            return false;
        },
        [ElementType.assign]: async (context) => {
            context.chat.variables[context.current_element.data.variable] =
                this.insertVariables(context.current_element.data.value, context.chat.variables);
            context.chat.system_data.position = context.current_element.data.next;
            return true;
        },
        [ElementType.condition]: async (context) => {
            let result: boolean;
            context.current_element.data.first_value =
                this.insertVariables(context.current_element.data.first_value, context.chat.variables);
            context.current_element.data.second_value =
                this.insertVariables(context.current_element.data.second_value, context.chat.variables);
            switch (context.current_element.data.operation){
            case '>': {
                result = context.current_element.data.first_value > context.current_element.data.second_value;
                break;
            } case '=': {
                result = context.current_element.data.first_value == context.current_element.data.second_value;
                break;
            } default: throw new Error('Unsupported operation');
            }
            if (context.current_element.data.negation) result = !result;
            if (result)
                context.chat.system_data.position = context.current_element.data.true_next;
            else
                context.chat.system_data.position = context.current_element.data.false_next;
            return true;
        }
    };
}