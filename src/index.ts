import { Plugin } from "esbuild";
import fs from "fs";
import gql from "graphql-tag";
import { DocumentNode } from "graphql";

interface GraphQLLoaderPluginOptions {
  filterRegex: RegExp;
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
        fs.promises.readFile(args.path).then((data) => ({
          contents: `export default ${documentNodeToString(
            gql(data.toString())
          )};`,
        }))
      );
    },
  };
};

export default graphqlLoaderPlugin;
