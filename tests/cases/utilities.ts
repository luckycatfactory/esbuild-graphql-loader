import fs from "fs";
import gql from "graphql-tag";
import { DocumentNode } from "graphql";

interface JSONLocation {
  end: number;
  start: number;
}

interface JSONDocumentNode extends Omit<DocumentNode, "loc"> {
  loc?: JSONLocation;
}

// DocumentNode Location instances have a toJSON on them. That means that by
// default, when JSON.stringify is called, is will call that method. That ends
// up stripping out data like loc.body. Therefore, for us to compare the
// post-serialized AST to a fresh DocumentNode, we need to perform this same
// serialization before comparing.
//
export const getJSONDocumentNodeFromString = (
  dataString: string
): JSONDocumentNode => {
  const documentNode: DocumentNode = gql(dataString);

  if (documentNode.loc) {
    return {
      ...documentNode,
      loc: documentNode.loc.toJSON(),
    };
  }

  return documentNode;
};

export const importFileAsString = (absolutePath: string): Promise<string> =>
  fs.promises.readFile(absolutePath).then((data) => data.toString());
