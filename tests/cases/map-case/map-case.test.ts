import path from 'path';
import { optimizeDocumentNode } from '@graphql-tools/optimize';
import gql from 'graphql-tag';

import {
  getJSONDocumentNodeFromString,
  importFileAsString,
} from '../utilities';
import output from './output';

describe('map case', () => {
  it('generates the expected output', () => {
    const targetFile = path.join(__dirname, './target.graphql');
    return importFileAsString(targetFile).then((data) => {
      const ast = optimizeDocumentNode(gql(data));
      const expected = getJSONDocumentNodeFromString(ast);

      expect(output).toEqual(expected);
    });
  });
});
