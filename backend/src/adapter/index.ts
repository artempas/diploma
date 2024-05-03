import db from '../db';
import LimitedAdapter from './limiter';
import {SenderType} from '../types/message';
import {Interpreter} from '../interpreter/interpreter';

export function init_adapter (){
    LimitedAdapter.getInstance().afterMessageReceived.push(
        (msg) => db.Messages.saveAdapterMessage(msg, SenderType.user),
        Interpreter.getInstance().handleMessage.bind(Interpreter.getInstance())
    );
    LimitedAdapter.getInstance().afterMessageSent.push(
        (msg) => db.Messages.saveAdapterMessage(msg, SenderType.bot)
    );
}