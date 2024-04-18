/* @jsxImportSource vue */
import {Position} from "@vue-flow/core";
import {h} from "vue";
import Chip from "primevue/chip";

const namesMap={
    init: 'Начало',
    send_message: 'Сообщение',
    assign: 'Присвоить',
    input: 'Ввод',
    menu: 'Меню',
    condition: 'Условие',
}

export function getLabel(element, content){
    // return h('div', [h(Chip, {label: namesMap[element]}), h('p', content)])
    return <div>
        <h4>{namesMap[element].toString()}</h4>
            <p style={{ whiteSpace: "pre-line", "overflow-wrap":"break-word"}}>
                {content}
            </p>

    </div>
}

export function updateLabel(element){
    switch (element.data.type){
        case 'send_message': {
            element.label = getLabel('send_message', element.data.text);
            break;
        }
        case 'init': {
            element.label = getLabel('init', element.data.text);
            break;
        }
        case 'assign': {
            element.label = getLabel('assign', `${element.data.variable}=${element.data.value}`)
            break;
        }
        case 'input': {
            element.label = getLabel('input', `${element.data.message}\n${element.data.variable}=`)
            break;
        }

    }
}

export const typesMap={
    'init':{
        type:'output',
        connectable: 'single',
        label:{...getLabel('init', 'Начало')},
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
        label: getLabel('send_message', 'Сообщение'),
        targetPosition: Position.Right,
        dimensions:{
            height:200,
            width:100
        },
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
            variable:'variable',
            value: 'value'
        },
        label: getLabel('assign','variable=value')
    },
    'input':{
        type: 'default',
        targetPosition: Position.Right,
        sourcePosition: Position.Left,
        label:getLabel('input', 'Ввод\nvariable='),
        connectable: 'single',
        data:{
            type:'input',
            variable:'variable',
            message: 'Ввод'
        }
    },
    'menu':{
        type: 'input',
        connectable: 'single',
        sourcePosition: Position.Left,
        label: {...getLabel('menu','Меню')},
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
            label:getLabel('condition','1=1'),
            data: {
                type: 'condition',
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
            class:['nodrag', 'true'],
            targetPosition: Position.Right,
            position:{
                x:2,y:90
            },
            label:"Истина"
        },
        {
            type: 'output',
            connectable:'single',
            expandParent:true,
            class:['nodrag', 'false'],
            targetPosition: Position.Right,
            label:"Ложь",
            position: {
                x:2,y:130
            }
        }
    ]
}
export function constructNode(type, position){
    const id = type==='init'?'init':crypto.randomUUID()
    console.log(`constuctNode ${type}`)
    const node = JSON.parse(JSON.stringify(typesMap[type]))
    if (type==='menu'){
        return [
            {...node, id, position},
            {...typesMap.menuButton,
                parentNode: id,
                position:{x:0, y: 80},
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
