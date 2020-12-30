import path from "path";

import {
  getJSONDocumentNodeFromString,
  importFileAsString,
} from "../utilities";
import output from "./output";

describe("topological graphql imports", () => {
  it("generates the expected output", () => {
    const targetFile = path.join(__dirname, "./target.graphql");
    const userFile = path.join(__dirname, "./user.graphql");
    const timestampsFile = path.join(__dirname, "./timestamps.graphql");

    return Promise.all([
      importFileAsString(targetFile, 3),
      importFileAsString(userFile, 2),
      importFileAsString(timestampsFile),
    ]).then(([targetData, userData, timestampsData]) => {
      const expectedDataString = timestampsData + userData + targetData;

      const expected = getJSONDocumentNodeFromString(expectedDataString);

      expect(output).toEqual(expected);
    });
  });
});
