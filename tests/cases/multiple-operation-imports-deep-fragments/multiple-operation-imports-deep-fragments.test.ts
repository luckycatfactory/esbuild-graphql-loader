import path from 'path';

import {
  findDefinitionNodeByName,
  generateJSONDocumentNodeFromOperationDefinition,
  getJSONDocumentNodeFromString,
  importFileAsString,
} from '../utilities';
import * as AllExports from './output';

describe('multiple operation imports deep fragments', () => {
  it('generates the expected output', () => {
    const targetFile = path.join(__dirname, './target.graphql');
    const externalFragmentFile = path.join(
      __dirname,
      './imported-fragment.graphql'
    );

    return Promise.all([
      importFileAsString(targetFile, 2),
      importFileAsString(externalFragmentFile),
    ]).then(([targetFileData, fragmentFileData]) => {
      const expectedDataString = fragmentFileData + targetFileData;
      const expected = getJSONDocumentNodeFromString(expectedDataString);
      const targetDocument = getJSONDocumentNodeFromString(targetFileData);
      const externalFragmentDocument = getJSONDocumentNodeFromString(
        fragmentFileData
      );
      const queryDefinition = findDefinitionNodeByName(targetDocument, 'Query');
      const anotherQueryDefinition = findDefinitionNodeByName(
        targetDocument,
        'AnotherQuery'
      );
      const firstInternalFragment = findDefinitionNodeByName(
        targetDocument,
        'SomeFragmentAfterTheQuery'
      );
      const secondInternalFragment = findDefinitionNodeByName(
        targetDocument,
        'SomeFragmentBeforeTheQuery'
      );
      const externalFragment = findDefinitionNodeByName(
        externalFragmentDocument,
        'SomeImportedFragment'
      );
      expect(AllExports).toEqual({
        default: expected,
        Query: generateJSONDocumentNodeFromOperationDefinition(
          queryDefinition,
          [externalFragment, secondInternalFragment, firstInternalFragment]
        ),
        AnotherQuery: generateJSONDocumentNodeFromOperationDefinition(
          anotherQueryDefinition,
          [externalFragment]
        ),
      });
    });
  });
});
