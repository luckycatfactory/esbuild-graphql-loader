import { Plugin } from "esbuild";
import fs from "fs";
import gql from "graphql-tag";

interface GraphQLLoaderPluginOptions {
  filterRegex: RegExp;
}

const defaultOptions: GraphQLLoaderPluginOptions = {
  filterRegex: /\.graphql$/,
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
        fs.promises.readFile(args.path).then((data) => ({
          contents: `export default ${JSON.stringify(gql(data.toString()))};`,
        }))
      );
    },
  };
};

export default graphqlLoaderPlugin;
