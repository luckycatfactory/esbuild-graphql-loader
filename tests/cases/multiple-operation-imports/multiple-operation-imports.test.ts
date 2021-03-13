import path from 'path';

import {
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
        QueryA: expected.definitions[0],
        QueryB: expected.definitions[1],
        MutationA: expected.definitions[2],
        MutationB: expected.definitions[3],
        SubscriptionA: expected.definitions[4],
        SubscriptionB: expected.definitions[5],
      });
    });
  });
});
