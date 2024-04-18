import {Position} from "@vue-flow/core";

const typesMap={
    'init':{
        type:'output',
        connectable: 'single',
        label:'Начало',
        targetPosition: Position.Right,
        sourcePosition: Position.Left,
        data:{
            type: 'init',
            text:'Начало'
        }
    },
    'send_message':{
        type:'default',
        connectable: 'single',
        label:'Сообщение',
        targetPosition: Position.Right,
        sourcePosition: Position.Left,
        data:{
            type: 'send_message',
            text:'Сообщение'
        }
    },
    'assign': {
        type: 'default',
        targetPosition: Position.Right,
        sourcePosition: Position.Left,
        connectable: 'single',
        data: {
            type: 'assign',
            variableName:'variable',
            value: 'value'
        },
        label: 'variable=value'
    },
    'input':{
        type: 'default',
        targetPosition: Position.Right,
        sourcePosition: Position.Left,
        label:'Ввод',
        connectable: 'single',
        data:{
            type:'input',
            message: 'Ввод'
        }
    },
    'menu':{
        type: 'input',
        connectable: 'single',
        sourcePosition: Position.Left,
        label:'Меню',
        data: {
            text: 'Меню'
        }
    },
    'menuButton':{
        type: 'output',
        connectable:'single',
        targetPosition: Position.Right,
        expandParent:true,
        class:'nodrag',
        label:"Вариант 1",
        data:{
            text: 'Вариант 1'
        }

    },
    "condition":[
        {
            type: 'input',
            connectable: 'single',
            sourcePosition: Position.Left,
            label:'1=1',
            data: {
                first_value: '1',
                operation:'=',
                second_value:'1',
                negation:false,
            }
        },
        {
            type: 'output',
            connectable:'single',
            expandParent:true,
            class:'nodrag',
            targetPosition: Position.Right,
            position:{
                x:2,y:40
            },
            label:"Истина"
        },
        {
            type: 'output',
            connectable:'single',
            expandParent:true,
            class:'nodrag',
            targetPosition: Position.Right,
            label:"Ложь",
            position: {
                x:2,y:80
            }
        }
    ]
}
export function constructNode(type, position){
    const id = type==='init'?'init':crypto.randomUUID()
    console.log(`constuctNode ${type}`)
    const node = typesMap[type]
    if (type==='menu'){
        return [
            {...node, id, position},
            {...typesMap.menuButton,
                parentNode: id,
                position:{x:0, y: 40},
                id: crypto.randomUUID(),
                }
        ]
    }
    if (type==='condition'){
        node[0].id=id;
        node[0].position=position
        node[1].parentNode=id;
        node[2].parentNode=id;
        node[1].id=crypto.randomUUID();
        node[2].id=crypto.randomUUID();
        return node
    }
    return [{...node, id, position}]
}
