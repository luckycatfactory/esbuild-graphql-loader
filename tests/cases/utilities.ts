import fs from 'fs';
import gql from 'graphql-tag';
import { NameNode, DefinitionNode, DocumentNode } from 'graphql';

interface JSONLocation {
  end: number;
  start: number;
}

interface JSONDocumentNode extends Omit<DocumentNode, 'loc'> {
  loc?: JSONLocation;
}

type NameableDefinitionNode = Extract<DefinitionNode, { name?: NameNode }>;

const isNameableDefinitionNode = (
  definitionNode: DefinitionNode
): definitionNode is NameableDefinitionNode => {
  return definitionNode.kind !== 'SchemaDefinition';
};

export const findDefinitionNodeByName = (
  documentNode: JSONDocumentNode,
  name: string
): NameableDefinitionNode => {
  for (let i = 0; i < documentNode.definitions.length; i++) {
    const definition = documentNode.definitions[i];

    if (isNameableDefinitionNode(definition)) {
      if (definition.name?.value === name) return definition;
    }
  }

  throw new Error(`Attempt made to find non-existent DefinitionNode: ${name}`);
};

export const generateJSONDocumentNodeFromOperationDefinition = (
  operationDefinition: DefinitionNode,
  fragments: NameableDefinitionNode[] = []
): JSONDocumentNode => ({
  kind: 'Document',
  definitions: [operationDefinition, ...fragments],
});

// DocumentNode Location instances have a toJSON on them. That means that by
// default, when JSON.stringify is called, is will call that method. That ends
// up stripping out data like loc.body. Therefore, for us to compare the
// post-serialized AST to a fresh DocumentNode, we need to perform this same
// serialization before comparing.
//
export const getJSONDocumentNodeFromString = (
  data: string | DocumentNode
): JSONDocumentNode => {
  const documentNode: DocumentNode =
    typeof data === 'string' ? gql(data) : data;

  if (documentNode.loc) {
    return {
      ...documentNode,
      loc: documentNode.loc.toJSON(),
    };
  }

  return documentNode;
};

export const importFileAsString = (
  absolutePath: string,
  withoutFirstNLines = 0
): Promise<string> =>
  fs.promises.readFile(absolutePath).then((data) => {
    const fullString = data.toString();
    const lines = fullString.split('\n');

    return lines.slice(withoutFirstNLines, lines.length).join('\n') + '\n';
  });
