import path from 'path';

import {
  generateJSONDocumentNodeFromOperationDefinition,
  getJSONDocumentNodeFromString,
  importFileAsString,
} from '../utilities';
import * as AllExports from './output';

describe('multiple operation imports', () => {
  it('generates the expected output', () => {
    const targetFile = path.join(__dirname, './target.graphql');
    return importFileAsString(targetFile).then((data) => {
      const expected = getJSONDocumentNodeFromString(data);

      expect(AllExports).toEqual({
        default: expected,
        QueryA: generateJSONDocumentNodeFromOperationDefinition(
          expected.definitions[0]
        ),
        QueryB: generateJSONDocumentNodeFromOperationDefinition(
          expected.definitions[1]
        ),
        MutationA: generateJSONDocumentNodeFromOperationDefinition(
          expected.definitions[2]
        ),
        MutationB: generateJSONDocumentNodeFromOperationDefinition(
          expected.definitions[3]
        ),
        SubscriptionA: generateJSONDocumentNodeFromOperationDefinition(
          expected.definitions[4]
        ),
        SubscriptionB: generateJSONDocumentNodeFromOperationDefinition(
          expected.definitions[5]
        ),
      });
    });
  });
});
