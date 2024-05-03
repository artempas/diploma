
export type MessageData={
    text: string
    buttons?: Button[]
}
export type Button={
    text: string
}

export enum SenderType{
    bot='bot',
    user='user'
}