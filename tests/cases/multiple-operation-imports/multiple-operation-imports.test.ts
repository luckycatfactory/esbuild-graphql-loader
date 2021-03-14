import path from 'path';

import {
  findDefinitionNodeByName,
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

      const queryADefinition = findDefinitionNodeByName(expected, 'QueryA');
      const queryBDefinition = findDefinitionNodeByName(expected, 'QueryB');
      const mutationADefinition = findDefinitionNodeByName(
        expected,
        'MutationA'
      );
      const mutationBDefinition = findDefinitionNodeByName(
        expected,
        'MutationB'
      );
      const subscriptionADefinition = findDefinitionNodeByName(
        expected,
        'SubscriptionA'
      );
      const subscriptionBDefinition = findDefinitionNodeByName(
        expected,
        'SubscriptionB'
      );

      expect(AllExports).toEqual({
        default: expected,
        QueryA: generateJSONDocumentNodeFromOperationDefinition(
          queryADefinition
        ),
        QueryB: generateJSONDocumentNodeFromOperationDefinition(
          queryBDefinition
        ),
        MutationA: generateJSONDocumentNodeFromOperationDefinition(
          mutationADefinition
        ),
        MutationB: generateJSONDocumentNodeFromOperationDefinition(
          mutationBDefinition
        ),
        SubscriptionA: generateJSONDocumentNodeFromOperationDefinition(
          subscriptionADefinition
        ),
        SubscriptionB: generateJSONDocumentNodeFromOperationDefinition(
          subscriptionBDefinition
        ),
      });
    });
  });
});
