import path from 'path';

import {
  findDefinitionNodeByName,
  generateJSONDocumentNodeFromOperationDefinition,
  getJSONDocumentNodeFromString,
  importFileAsString,
} from '../utilities';
import * as AllExports from './output';

describe('multiple operation imports fragments', () => {
  it('generates the expected output', () => {
    const targetFile = path.join(__dirname, './target.graphql');
    return importFileAsString(targetFile).then((data) => {
      const expected = getJSONDocumentNodeFromString(data);
      const queryDefinition = findDefinitionNodeByName(expected, 'Query');
      const mutationDefinition = findDefinitionNodeByName(expected, 'Mutation');
      const subscriptionDefinition = findDefinitionNodeByName(
        expected,
        'Subscription'
      );
      const subscriptionWithoutFragmentDefinition = findDefinitionNodeByName(
        expected,
        'SubscriptionWithoutFragment'
      );
      const namePartsFragment = findDefinitionNodeByName(expected, 'NameParts');
      const jobPartsFragment = findDefinitionNodeByName(expected, 'JobParts');

      expect(AllExports).toEqual({
        default: expected,
        Query: generateJSONDocumentNodeFromOperationDefinition(
          queryDefinition,
          [namePartsFragment]
        ),
        Mutation: generateJSONDocumentNodeFromOperationDefinition(
          mutationDefinition,
          [namePartsFragment, jobPartsFragment]
        ),
        Subscription: generateJSONDocumentNodeFromOperationDefinition(
          subscriptionDefinition,
          [jobPartsFragment]
        ),
        SubscriptionWithoutFragment: generateJSONDocumentNodeFromOperationDefinition(
          subscriptionWithoutFragmentDefinition
        ),
      });
    });
  });
});
