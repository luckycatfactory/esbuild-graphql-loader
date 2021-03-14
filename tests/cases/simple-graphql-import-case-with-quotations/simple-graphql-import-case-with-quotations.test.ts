import path from 'path';

import {
  getJSONDocumentNodeFromString,
  importFileAsString,
} from '../utilities';
import output from './output';

describe('simple graphql import case with quotations', () => {
  it('generates the expected output', () => {
    const targetFile = path.join(__dirname, './target.graphql');
    const userFile = path.join(__dirname, './user.graphql');

    return Promise.all([
      importFileAsString(targetFile, 2),
      importFileAsString(userFile),
    ]).then(([targetData, userData]) => {
      const expectedDataString = userData + targetData;
      const expected = getJSONDocumentNodeFromString(expectedDataString);

      expect(output).toEqual(expected);
    });
  });
});
