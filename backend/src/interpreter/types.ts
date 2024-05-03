import {Element, ElementType} from '../types/scenario';
import {Chat} from '../entity/Chat';

export type ElementTypeExtended = ElementType | ChildTypes;
export enum ChildTypes{
    menuButton = 'menuButton',
    conditionOutput = 'conditionOutput',
}

export type visual_data = (node_type | edge_type)[];
export type node_type = {id: string, parentNode?: string} & (
    {
        data: {
            type: 'init'
            text: string
        }
    }
    | {
        data: {
            type: 'send_message',
            text: string
        }
    }
    | {
        data: {
            type: 'assign',
            variable: string,
            value: string
        }
    }
    | {
        data: {
            type: 'input',
            variable: string,
            message: string
        }
    }
    | {
        data: {
            type: 'menu',
            text: string
        }
    }
    | {
        data: {
            type: 'menuButton',
            text: string
        },
        parentNode: string
    }
    | {
        data: {
            type: 'condition',
            first_value: string,
            operation: '='|'>',
            second_value: string,
            negation: false
        }
    }
    | {
        data: {
            type: 'conditionOutput',
            positive: boolean
        },
        parentNode: string
    })


export type edge_type = {
    id: string,
    source: string,
    target: string,
    sourceNode: node_type,
    targetNode: node_type
};

export type context_type<elementType extends ElementType>={
        current_element: Element<elementType>,
        chat: Chat,
        input?: string
    }