import { text } from 'stream/consumers';
import { Interpreter } from '../../src/interpreter/interpreter';
import { FakeAdapter } from './FakeAdapter';
import { Chat } from '../../src/entity/Chat';

describe('Interpreter', () => {
    let interpreter: Interpreter;
    let adapter: FakeAdapter;

    beforeEach(() => {
        adapter = new FakeAdapter();
        interpreter = Interpreter.getInstance();
        interpreter.setAdapter(adapter);
    });

    describe('elements_map', () => {
        describe('init', () => {
            it('should send a message', async () => {
                const context = {
                    current_element: {
                        element_type: 'init',
                        data: {
                            text: 'Hello, world!',
                            next: 'next_element',
                        }
                    },
                    chat: {
                        connector: {
                            scenario: {
                                logical_data: {
                                    init: {
                                        element_type: 'init',
                                        data: {
                                            text: 'Hello, world!',
                                            next: 'next_element',
                                        },
                                    },
                                    next_element: {
                                        element_type: 'send_message',
                                        data: {
                                            text: 'Next element',
                                            next: 'final_element',
                                        },
                                    },
                                    final_element: {
                                        element_type: 'final',
                                        data: {},
                                    },
                                },
                            },
                        },
                        system_data: {
                            position: 'init',
                        },
                        variables: {},
                    },
                    text: '',
                };
                // @ts-ignore
                const result = await interpreter.elements_map.init(context);
                expect(result).toBe(true);
                expect(context.chat.system_data.position).toBe('next_element');
                expect(adapter.messages).toEqual([
                    {
                        chat: context.chat,
                        text: 'Hello, world!',
                    },
                ]);
            });
        });

        describe('send_message', () => {
            it('should send a message', async () => {
                const context = {
                    current_element: {
                        element_type: 'send_message',
                        data: {
                            text: 'Next element',
                            next: 'final_element',
                        }
                    },
                    chat: {
                        connector: {
                            scenario: {
                                logical_data: {
                                    init: {
                                        element_type: 'init',
                                        data: {
                                            text: 'Hello, world!',
                                            next: 'next_element',
                                        },
                                    },
                                    next_element: {
                                        element_type: 'send_message',
                                        data: {
                                            text: 'Next element',
                                            next: 'final_element',
                                        },
                                    },
                                    final_element: {
                                        element_type: 'final',
                                        data: {},
                                    },
                                },
                            },
                        },
                        system_data: {
                            position: 'next_element',
                        },
                        variables: {},
                    },
                    text: '',
                };
                // @ts-ignore
                const result = await interpreter.elements_map.init(context);
                expect(result).toBe(true);
                expect(context.chat.system_data.position).toBe('final_element');
                expect(adapter.messages).toEqual([
                    {
                        chat: context.chat,
                        text: 'Next element',
                    },
                ]);
            });
        });

        describe('input', () => {
            it('should process input', async () => {
                const message = {
                    current_element: {
                        element_type: 'input',
                        data: {
                            message: 'Enter your name:',
                            variable: 'name',
                            next: 'next_element',
                        },
                    },
                    chat: {
                        connector: {
                            scenario: {
                                logical_data: {
                                    input: {
                                        element_type: 'input',
                                        data: {
                                            message: 'Enter your name:',
                                            variable: 'name',
                                            next: 'next_element',
                                        },
                                    },
                                    next_element: {
                                        element_type: 'any',
                                        data: {},
                                    },
                                },
                            },
                        },
                        system_data: {
                            position: 'input',
                        },
                        variables: {},
                    },
                    input: 'John Doe',
                };
                // @ts-ignore
                const res = await interpreter.elements_map.input(message);
                expect(res).toBe(false);
                expect(message.chat.system_data.position).toBe('input');
                // @ts-ignore
                expect(message.chat.system_data.on_input).toBe(true);
                // @ts-ignore
                const res2 = await interpreter.elements_map.input(message);
                expect(res2).toBe(true);
                expect(message.chat.system_data.position).toBe('next_element');
                // @ts-ignore
                expect(message.chat.variables.name).toBe('John Doe');
            });
        });
        describe('menu', () => {
            let message: any;
            beforeEach(() => {
                message = {
                    chat: {
                        id: '123',
                        connector: {
                            scenario: {
                                logical_data: {
                                    init: {
                                        element_type: 'init',
                                        data: {
                                            text: 'Hello, world!',
                                            next: 'next_element',
                                        },
                                    },
                                    next_element: {
                                        element_type: 'menu',
                                        data: {
                                            text: 'Menu',
                                            buttons: [
                                                {
                                                    id: '1',
                                                    text: '1',
                                                    next: 'final'
                                                },
                                                {
                                                    id: '2',
                                                    text: '2',
                                                    next: 'final2'
                                                },
                                                {
                                                    id: '3',
                                                    text: '3',
                                                    next: 'final3'
                                                }
                                            ],
                                        },
                                    },
                                    final: {
                                        element_type: 'message',
                                        data: {
                                            text: '1',
                                            next: 'init'
                                        }
                                    }
                                }
                            },
                        },
                        variables: {},
                        system_data: {
                            position: 'next_element',
                        },
                    },
                };
            });
            it('should handle the menu element and return true', async () => {
                message.current_element = message.chat.connector.scenario.logical_data[message.chat.system_data.position];
                const res = await interpreter.elements_map.menu(message);
                expect(res).toBe(false);
                expect(message.chat.system_data.position).toBe('next_element');
                expect(message.chat.system_data.on_menu).toBe(true);
                expect(adapter.messages).toEqual([
                    {
                        text: 'Menu',
                        buttons: [
                            { text: '1' },
                            { text: '2' },
                            { text: '3' },
                        ],
                        chat: message.chat
                    }
                ]);
            });

            it('should handle the menu element and return false if on_menu is false', async () => {
                message.current_element = message.chat.connector.scenario.logical_data[message.chat.system_data.position];
                message.chat.system_data.position = 'menu';
                message.chat.system_data.on_menu = true;
                message.input = '1';
                const res = await interpreter.elements_map.menu(message);
                expect(res).toBe(true);
                expect(message.chat.system_data.on_menu).toBe(false);
                expect(message.chat.system_data.position).toBe('final');
            });
        });

        describe('assign', () => {
            it('should handle the assign element', async () => {
                const message: any = {
                    chat: {
                        id: '123',
                        connector: {
                            scenario: {
                                logical_data: {
                                    init: {
                                        element_type: 'init',
                                        data: {
                                            text: 'Hello, world!',
                                            next: 'next_element',
                                        },
                                    },
                                    next_element: {
                                        element_type: 'assign',
                                        data: {
                                            variable: 'test',
                                            value: '1',
                                            next: 'final'
                                        }
                                    },
                                    final: {
                                        element_type: 'message',
                                        data: {
                                            text: '1',
                                            next: 'init'
                                        }
                                    }
                                }
                            },
                        },
                        variables: {},
                        system_data: {
                            position: 'next_element',
                        },
                    },
                };
                message.current_element = message.chat.connector.scenario.logical_data[message.chat.system_data.position];
                // @ts-ignore
                const res = await interpreter.elements_map.assign(message);
                expect(res).toBe(true);
                // @ts-ignore
                expect(message.chat.variables.test).toBe('1');
                expect(message.chat.system_data.position).toBe('final');
            });
        });
        describe('condition', () => {
            it('should return true if first_value is equal to second_value', async () => {
                const message = {
                    chat: {
                        variables: {
                            test: '1',
                        },
                        system_data: {
                            position: 'next_element',
                        },
                    },
                    current_element: {
                        data: {
                            first_value: '${test}',
                            second_value: '${test}',
                            operation: '=',
                            true_next: 'finalT',
                            false_next: 'finalF',
                        },
                    },
                };
                // @ts-ignore
                const res = await interpreter.elements_map.condition(message);
                expect(res).toBe(true);
                expect(message.chat.system_data.position).toBe('finalT');
            });
        
            it('should return false if first_value is not equal to second_value', async () => {
                const message = {
                    chat: {
                        variables: {
                            test: '1',
                        },
                        system_data: {
                            position: 'next_element',
                        },
                    },
                    current_element: {
                        data: {
                            first_value: '${test}',
                            second_value: '2',
                            operation: '=',
                            true_next: 'finalT',
                            false_next: 'finalF',
                        },
                    },
                };
                // @ts-ignore
                const res = await interpreter.elements_map.condition(message);
                expect(res).toBe(true);
                expect(message.chat.system_data.position).toBe('finalF');
            });
        });
    });
});

