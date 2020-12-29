import { BuildOptions } from "esbuild";
import graphqlLoaderPlugin from "../../../src";

const buildOptions: BuildOptions = {
  plugins: [graphqlLoaderPlugin({ filterRegex: /\.gql$/ })],
};

export default buildOptions;
