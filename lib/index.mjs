// src/index.ts
import fs2 from "fs";
import gql from "graphql-tag";
import readline2 from "readline";
import path2 from "path";
var generateDocumentNodeString = (graphqlDocument, mapDocumentNode) => {
  const documentNodeToUse = mapDocumentNode ? mapDocumentNode(graphqlDocument) : graphqlDocument;
  return JSON.stringify(documentNodeToUse, (key, value) => value === void 0 ? "__undefined" : value).replace(/"__undefined"/g, "undefined");
};
var topologicallySortParsedFiles = (parsedFiles, cache) => {
  const visitedFiles = new Set();
  const sorted = [];
  const visitFile = (file) => {
    if (visitedFiles.has(file))
      return;
    visitedFiles.add(file);
    file.imports.forEach((importFileEntry) => {
      const importedFile = cache[importFileEntry.absolutePath];
      visitFile(importedFile);
    });
    sorted.unshift(file);
  };
  parsedFiles.forEach(visitFile);
  return sorted;
};
var parseGraphQLFile = (filePath) => new Promise((resolve) => {
  const readInterface = readline2.createInterface({
    input: fs2.createReadStream(filePath)
  });
  let body = "";
  const imports = [];
  let hasExhaustedImports = false;
  const parseImportAndCapture = (importCommentPrefix, line) => {
    const relativePath = line.replace(importCommentPrefix, "");
    const absolutePath = path2.join(path2.dirname(filePath), relativePath);
    imports.push({
      absolutePath,
      relativePath
    });
  };
  readInterface.on("line", (line) => {
    if (line.startsWith("#import ")) {
      parseImportAndCapture("#import ", line);
    } else if (line.startsWith("# import ")) {
      parseImportAndCapture("# import ", line);
    } else if (hasExhaustedImports) {
      body += line + "\n";
    } else if (line[0] !== "#" && line !== "") {
      hasExhaustedImports = true;
      body += line + "\n";
    }
  });
  readInterface.on("close", () => {
    resolve({body: body.trim(), filePath, imports});
  });
});
var generateGraphQLString = (entryPointPath) => {
  const cache = {};
  const parsePromises = [];
  const seenImportPaths = new Set();
  const visitAndParse = (filePath) => {
    if (cache[filePath])
      return Promise.resolve(null);
    return new Promise((resolve) => {
      parseGraphQLFile(filePath).then((parsedFile) => {
        cache[parsedFile.filePath] = parsedFile;
        parsedFile.imports.forEach((importEntry) => {
          if (!seenImportPaths.has(importEntry.absolutePath)) {
            seenImportPaths.add(importEntry.absolutePath);
            parsePromises.push(visitAndParse(importEntry.absolutePath));
          }
        });
        const nextPromise = parsePromises.shift();
        if (nextPromise) {
          return nextPromise.then(resolve);
        }
        return resolve(null);
      });
    });
  };
  return visitAndParse(entryPointPath).then(() => {
    const files = topologicallySortParsedFiles(Object.values(cache), cache);
    const graphqlString = files.reduce((accumulator, file) => {
      return file.body + "\n\n" + accumulator;
    }, "");
    return graphqlString;
  });
};
var generateContentsFromGraphqlString = (graphqlString, mapDocumentNode) => {
  const graphqlDocument = gql(graphqlString);
  const documentNodeAsString = generateDocumentNodeString(graphqlDocument, mapDocumentNode);
  const lines = graphqlDocument.definitions.reduce((accumulator, definition, index) => {
    if (definition.kind === "OperationDefinition" && definition.name && definition.name.value) {
      const name = definition.name.value;
      accumulator.push(`export const ${name} = documentNode.definitions[${index}];`);
    }
    return accumulator;
  }, [`const documentNode = ${documentNodeAsString};`]);
  lines.push(`export default documentNode;`);
  return lines.join("\n");
};
var graphqlLoaderPlugin = (options = {}) => ({
  name: "graphql-loader",
  setup(build) {
    build.onLoad({filter: options.filterRegex || /\.graphql$/}, (args) => generateGraphQLString(args.path).then((graphqlString) => ({
      contents: generateContentsFromGraphqlString(graphqlString, options.mapDocumentNode)
    })));
  }
});
var src_default = graphqlLoaderPlugin;
export {
  src_default as default
};
