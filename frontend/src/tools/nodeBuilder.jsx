/* @jsxImportSource vue */
import {Position} from "@vue-flow/core";

const namesMap={
    init: 'Начало',
    send_message: 'Сообщение',
    assign: 'Присвоить',
    input: 'Ввод',
    menu: 'Меню',
    condition: 'Условие',
}

function getHighlightedText(text, highlight) {
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(highlight);
    console.log(parts);
    return <span> { parts.map((part, i) => 
        <span key={i} style={part.match(highlight) ? { color: '#2450a5' } : {} }>
            { part }
        </span>)
    } </span>;
}

export function getLabel(element, content){
    // return h('div', [h(Chip, {label: namesMap[element]}), h('p', content)])
    return <div class={`${element}-label node-label`}>
        <h4 class='node-label-name'>{namesMap[element].toString()}</h4>
            <p class='node-label-content'>
                {getHighlightedText(content, /(\$\{[A-Za-z_\-0-9]+})/gi)}
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
        case 'condition':{
            element.label = getLabel('condition', `${element.data.first_value} ${element.data.operation} ${element.data.second_value}`)
            break;
        }
        case 'menuButton':{
            element.label=element.data.text;
            console.log('update_label')
            console.log(element)
            break
        }
        case 'menu':{
            element.label = getLabel('menu', element.data.text)
            break;
        }
    }
}

export const typesMap= {
    'init':{
        type:'input',
        connectable: 'single',
        class: ['node'],
        label:{...getLabel('init', 'Начало')},
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
        data:{
            type: 'init',
            text:'Начало'
        }
    },
    'send_message':{
        type:'default',
        class: ['node'],
        // connectable: 'single',
        label: getLabel('send_message', 'Сообщение'),
        targetPosition: Position.Left,
        dimensions:{
            height:200,
            width:100
        },
        sourcePosition: Position.Right,
        data:{
            type: 'send_message',
            text:'Сообщение'
        }
    },
    'assign': {
        type: 'default',
        targetPosition: Position.Left,
        class: ['node'],
        sourcePosition: Position.Right,
        // connectable: 'single',
        data: {
            type: 'assign',
            variable:'variable',
            value: 'value'
        },
        label: getLabel('assign','variable=value')
    },
    'input':{
        type: 'default',
        class: ['node'],
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
        label:getLabel('input', 'Ввод\nvariable='),
        // connectable: 'single',
        data:{
            type:'input',
            variable:'variable',
            message: 'Ввод'
        }
    },
    'menu':{
        type: 'output',
        // connectable: 'single',
        class:['menu-node', 'node'],
        targetPosition: Position.Left,
        label: {...getLabel('menu','Меню')},
        data: {
            type:'menu',
            text: 'Меню'
        }
    },
    'menuButton':{
        type: 'input',
        connectable:'single',
        sourcePosition: Position.Right,
        class:['nodrag', 'child'],
        label:"Вариант 1",
        data:{
            type:'menuButton',
            text: 'Вариант 1'
        }

    },
    "condition":[
        {
            type: 'output',
            class: ['node'],
            // connectable: 'single',
            dimensions:{
                height: 1700
            },
            targetPosition: Position.Left,
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
            type: 'input',
            connectable:'single',
            class:['nodrag', 'child', 'true'],
            sourcePosition: Position.Right,
            position:{
                x:0,y:80
            },
            label:"Истина",
            data:{
                type:'conditionOutput',
                positive:true
            }
        },
        {
            type: 'input',
            connectable:'single',
            class:['nodrag', 'child', 'false'],
            sourcePosition: Position.Right,
            label:"Ложь",
            position: {
                x:0,y:120
            },
            data: {
                type:'conditionOutput',
                positive:false
            }
        }
    ]
}
export function constructNode(type, position, parent, num_of_children){
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
    if (parent){
        return [{
            ...node, id,
            parentNode:parent.id,
            position:{
                x:0, y:80+40*num_of_children
            }
        }]
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
