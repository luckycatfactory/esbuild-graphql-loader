import { Plugin } from "esbuild";
import fs from "fs";
import gql from "graphql-tag";
import { DocumentNode } from "graphql";
import readline from "readline";
import path from "path";

interface GraphQLLoaderPluginOptions {
  filterRegex: RegExp;
}

interface Import {
  absolutePath: string;
  relativePath: string;
}

interface ParsedGraphQLFile {
  body: string;
  filePath: string;
  imports: Import[];
}

const defaultOptions: GraphQLLoaderPluginOptions = {
  filterRegex: /\.graphql$/,
};

// Definitions can be undefined, which will get stripped when JSON.stringify is
// run. For that reason, we temporarily serialize undefined, then swap it back
// to the value of undefined.
//
const documentNodeToString = (documentNode: DocumentNode): string =>
  JSON.stringify(documentNode, (key, value) =>
    value === undefined ? "__undefined" : value
  ).replace(/\"__undefined"/g, "undefined");

const topologicallySortParsedFiles = (
  parsedFiles: ParsedGraphQLFile[],
  cache: Record<string, ParsedGraphQLFile>
): ParsedGraphQLFile[] => {
  const visitedFiles = new Set();
  const sorted: ParsedGraphQLFile[] = [];

  const visitFile = (file: ParsedGraphQLFile): void => {
    if (visitedFiles.has(file)) return;

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

const parseGraphQLFile = (filePath: string): Promise<ParsedGraphQLFile> =>
  new Promise((resolve) => {
    const readInterface = readline.createInterface({
      input: fs.createReadStream(filePath),
    });
    let body = "";
    const imports: Import[] = [];

    let hasExhaustedImports = false;

    readInterface.on("line", (line) => {
      if (line.startsWith("#import ")) {
        const relativePath = line.replace("#import ", "");
        const absolutePath = path.join(path.dirname(filePath), relativePath);
        imports.push({
          absolutePath,
          relativePath,
        });
      } else if (hasExhaustedImports) {
        body += line + "\n";
      } else if (line[0] !== "#" && line !== "") {
        hasExhaustedImports = true;
        body += line + "\n";
      }
    });

    readInterface.on("close", () => {
      resolve({ body: body.trim(), filePath, imports });
    });
  });

const generateDocumentNodeString = (
  entryPointPath: string
): Promise<string> => {
  const cache: Record<string, ParsedGraphQLFile> = {};
  const parsePromises: Promise<null>[] = [];
  const seenImportPaths = new Set();

  const visitAndParse = (filePath: string): Promise<null> => {
    if (cache[filePath]) return Promise.resolve(null);

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

    const documentNodeString = files.reduce((accumulator, file) => {
      return file.body + "\n\n" + accumulator;
    }, "");

    return documentNodeString;
  });
};

const graphqlLoaderPlugin = (
  options: Partial<GraphQLLoaderPluginOptions> = {}
): Plugin => {
  const optionsWithDefaults: GraphQLLoaderPluginOptions = {
    ...defaultOptions,
    ...options,
  };

  return {
    name: "graphql-loader",
    setup(build) {
      build.onLoad({ filter: optionsWithDefaults.filterRegex }, (args) =>
        generateDocumentNodeString(args.path).then((documentNodeString) => ({
          contents: `export default ${documentNodeToString(
            gql(documentNodeString)
          )};`,
        }))
      );
    },
  };
};

export default graphqlLoaderPlugin;
