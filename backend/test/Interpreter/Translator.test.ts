import { ElementType, Element } from '../../src/types/scenario';
import Translator from '../../src/interpreter/translator';
import { visual_data } from '../../src/interpreter/types';
import mock_visual_data from './visual_data.json';
import mock_logical_data from './logical_data.json';

describe('Translator', () => {
    let translator: typeof Translator;

    beforeEach(() => {
        translator = Translator;
    });

    it('should correctly translate a visual schema into a logical schema', () => {
        // @ts-ignore
        const visualSchema: visual_data = mock_visual_data;

        // @ts-ignore
        const expectedLogicalSchema: Record<string, Element<ElementType>> = mock_logical_data;

        const logicalSchema = translator.visual_to_logical(visualSchema);

        expect(logicalSchema).toEqual(expectedLogicalSchema);
    });
});