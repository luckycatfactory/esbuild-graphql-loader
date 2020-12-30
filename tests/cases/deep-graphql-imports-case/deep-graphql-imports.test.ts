import path from "path";

import {
  getJSONDocumentNodeFromString,
  importFileAsString,
} from "../utilities";
import output from "./output";

describe("deep graphql imports", () => {
  it("generates the expected output", () => {
    const targetFile = path.join(__dirname, "./target.graphql");
    const userFile = path.join(__dirname, "./user.graphql");
    const postFile = path.join(__dirname, "./post.graphql");

    return Promise.all([
      importFileAsString(targetFile, 2),
      importFileAsString(userFile),
      importFileAsString(postFile, 2),
    ]).then(([targetData, userData, postData]) => {
      const expectedDataString = userData + postData + targetData;
      const expected = getJSONDocumentNodeFromString(expectedDataString);

      expect(output).toEqual(expected);
    });
  });
});
