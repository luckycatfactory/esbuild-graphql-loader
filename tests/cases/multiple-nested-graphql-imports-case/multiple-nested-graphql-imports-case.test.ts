import path from 'path';

import {
  getJSONDocumentNodeFromString,
  importFileAsString,
} from '../utilities';
import output from './output';

describe('multiple graphql imports', () => {
  it('generates the expected output', () => {
    const targetFile = path.join(__dirname, './nest/target.graphql');
    const userFile = path.join(__dirname, './user.graphql');
    const postFile = path.join(__dirname, './nest/deeper-nest/post.graphql');

    return Promise.all([
      importFileAsString(targetFile, 3),
      importFileAsString(userFile),
      importFileAsString(postFile),
    ]).then(([targetData, userData, postData]) => {
      const expectedDataString = userData + postData + targetData;
      const expected = getJSONDocumentNodeFromString(expectedDataString);

      expect(output).toEqual(expected);
    });
  });
});
