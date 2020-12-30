import path from 'path';

import {
  getJSONDocumentNodeFromString,
  importFileAsString,
} from '../utilities';
import output from './output';

describe('custom regex', () => {
  it('generates the expected output', () => {
    const targetFile = path.join(__dirname, './target.gql');
    return importFileAsString(targetFile).then((data) => {
      const expected = getJSONDocumentNodeFromString(data);

      expect(output).toEqual(expected);
    });
  });
});
