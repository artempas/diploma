import {edge_type, node_type, visual_data} from './types';
import {AssignData, ConditionData, Element, ElementType, InputData, MenuData, SendMessageData} from '../types/scenario';
class Translator {
    visual_to_logical (schema: visual_data): Record<string, Element<ElementType>> {
        const result: Record<string, Element<ElementType>> = {
            'init': {
                element_type: ElementType.init,
                data: {
                    text: 'Здравствуйте!',
                    next: 'init'
                }
            } as Element<ElementType.init>
        };
        for (let element of schema) {
            if (is_edge(element)) {
                if (element.target) {
                    this.add_edge(element, result);
                }
            } else {
                this.translate_node(element, result);
            }
        }
        return result;
    }


    private translate_node (node: node_type, result: Record<string, Element<ElementType>>) {
        switch (node.data.type){
        case 'menuButton': {
            if (result[node.parentNode!]){
                (result[node.parentNode!] as Element<ElementType.menu>).data.buttons.push({
                    id: node.id,
                    text: node.data.text,
                    next: 'init'
                });
            } else {
                result[node.parentNode!] = {
                    data: {
                        text: '',
                        buttons: [{
                            id: node.id,
                            text: node.data.text,
                            next: 'init'
                        }]
                    },
                    element_type: ElementType.menu
                };
            }
            break;
        }
        case 'conditionOutput': {
            break;
        }
        case 'assign': {
            result[node.id] = {
                data: {
                    variable: node.data.variable,
                    value: node.data.value,
                    next: 'init'
                },
                element_type: ElementType.assign
            };
            break;
        }
        case 'condition': {
            result[node.id] = {
                data: {
                    first_value: node.data.first_value,
                    second_value: node.data.second_value,
                    operation: node.data.operation,
                    negation: node.data.negation
                },
                element_type: ElementType.condition
            } as Element<ElementType.condition>;
            break;
        }
        case 'init': {
            result['init'] = {
                element_type: ElementType.init,
                data: {
                    next: 'init',
                    text: node.data.text
                }
            };
            break;
        }
        case 'input': {
            result[node.id] = {
                element_type: ElementType.input,
                data: {
                    variable: node.data.variable,
                    message: node.data.message,
                    next: 'init'
                }
            };
            break;
        }
        case 'menu': {
            result[node.id] = {
                element_type: ElementType.menu,
                data: {
                    text: node.data.text,
                    buttons: []
                }
            };
            break;
        }
        case 'send_message': {
            result[node.id] = {
                element_type: ElementType.send_message,
                data: {
                    text: node.data.text,
                    next: 'init'
                }
            };
        }
        }
    }

    private add_edge (edge: edge_type, result: Record<string, Element<ElementType>>) {
        if (edge.sourceNode.parentNode){
            if (!result[edge.sourceNode.parentNode]) throw new Error(`Parent node for ${edge.source} is not found`);
            if (edge.sourceNode.data.type === 'conditionOutput'){
                if (edge.sourceNode.data.positive)
                    (result[edge.sourceNode.parentNode]!.data as ConditionData).true_next = edge.target;
                else
                    (result[edge.sourceNode.parentNode]!.data as ConditionData).false_next = edge.target;
            } else if (edge.sourceNode.data.type === 'menuButton'){
                (result[edge.sourceNode.parentNode]!.data as MenuData)
                    .buttons
                    .filter((btn) => btn.id === edge.source)[0]!.next = edge.target;
            }
        } else {
            if (!result[edge.source]) throw new Error(`Node ${edge.source} not found`);
            (result[edge.source]!.data as SendMessageData|AssignData|InputData).next = edge.target;
        }
    }
}
function is_edge (element: edge_type | node_type): element is edge_type {
    return (element as edge_type).target !== undefined && (element as edge_type).source !== undefined;
}

const translator = new Translator();
export default translator;