import path from "path";

import {
  getJSONDocumentNodeFromString,
  importFileAsString,
} from "../utilities";
import output from "./output";

describe("diamond graphql imports", () => {
  it("generates the expected output", () => {
    const targetFile = path.join(__dirname, "./target.graphql");
    const userFile = path.join(__dirname, "./user.graphql");
    const postFile = path.join(__dirname, "./post.graphql");
    const timestampsFile = path.join(__dirname, "./timestamps.graphql");

    return Promise.all([
      importFileAsString(targetFile, 3),
      importFileAsString(userFile, 2),
      importFileAsString(postFile, 2),
      importFileAsString(timestampsFile),
    ]).then(([targetData, userData, postData, timestampsData]) => {
      const expectedDataString =
        timestampsData + userData + postData + targetData;
      const expected = getJSONDocumentNodeFromString(expectedDataString);

      expect(output).toEqual(expected);
    });
  });
});
