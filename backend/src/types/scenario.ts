export type Element<T extends ElementType> = {
    data: ElementData<T>,
    element_type: T,
};

export type ElementData<T extends ElementType> =
    T extends ElementType.send_message ? SendMessageData :
        T extends ElementType.menu ? MenuData :
            T extends ElementType.init ? SendMessageData :
                T extends ElementType.assign ? AssignData :
                    T extends ElementType.input ? InputData :
                        T extends ElementType.condition ? ConditionData :
                            unknown

export enum ElementType {
    send_message = 'send_message',
    menu = 'menu',
    init = 'init',
    condition = 'condition',
    input = 'input',
    assign = 'assign',
}

export type SendMessageData = {
    text: string,
    next: string
}

export type MenuData = {
    text: string,
    buttons: {
        id: string,
        text: string,
        next: string
    }[]
}

export type ConditionData = {
    first_value: number | string,
    operation: '>' | '=',
    second_value: number | string,
    negation: boolean,
    true_next: string,
    false_next: string
}

export type InputData = {
    message: string,
    variable: string,
    next: string
}

export type AssignData = {
    variable: string,
    value: any,
    next: string
}

