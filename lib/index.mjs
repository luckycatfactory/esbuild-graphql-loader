var __assign = Object.assign;

// src/index.ts
import fs2 from "fs";
import gql from "graphql-tag";
var defaultOptions = {
  filterRegex: /\.graphql$/
};
var graphqlLoaderPlugin = (options = {}) => {
  const optionsWithDefaults = __assign(__assign({}, defaultOptions), options);
  return {
    name: "graphql-loader",
    setup(build) {
      build.onLoad({filter: optionsWithDefaults.filterRegex}, (args) => fs2.promises.readFile(args.path).then((data) => ({
        contents: `export default ${JSON.stringify(gql(data.toString()))};`
      })));
    }
  };
};
var src_default = graphqlLoaderPlugin;
export {
  src_default as default
};
