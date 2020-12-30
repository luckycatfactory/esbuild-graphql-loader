var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __assign = Object.assign;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true}), module2);
};

// src/index.ts
__export(exports, {
  default: () => src_default
});
var fs = __toModule(require("fs"));
var graphql_tag = __toModule(require("graphql-tag"));
var readline = __toModule(require("readline"));
var path = __toModule(require("path"));
var defaultOptions = {
  filterRegex: /\.graphql$/
};
var documentNodeToString = (documentNode) => JSON.stringify(documentNode, (key, value) => value === void 0 ? "__undefined" : value).replace(/"__undefined"/g, "undefined");
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
  const readInterface = readline.default.createInterface({
    input: fs.default.createReadStream(filePath)
  });
  let body = "";
  const imports = [];
  let hasExhaustedImports = false;
  readInterface.on("line", (line) => {
    if (line.startsWith("#import ")) {
      const relativePath = line.replace("#import ", "");
      const absolutePath = path.default.join(path.default.dirname(filePath), relativePath);
      imports.push({
        absolutePath,
        relativePath
      });
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
var generateDocumentNodeString = (entryPointPath) => {
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
    const documentNodeString = files.reduce((accumulator, file) => {
      return file.body + "\n\n" + accumulator;
    }, "");
    return documentNodeString;
  });
};
var graphqlLoaderPlugin = (options = {}) => {
  const optionsWithDefaults = __assign(__assign({}, defaultOptions), options);
  return {
    name: "graphql-loader",
    setup(build) {
      build.onLoad({filter: optionsWithDefaults.filterRegex}, (args) => generateDocumentNodeString(args.path).then((documentNodeString) => ({
        contents: `export default ${documentNodeToString(graphql_tag.default(documentNodeString))};`
      })));
    }
  };
};
var src_default = graphqlLoaderPlugin;
