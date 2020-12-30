import { BuildOptions } from 'esbuild';
import { optimizeDocumentNode } from '@graphql-tools/optimize';
import graphqlLoaderPlugin from '../../../src';

const buildOptions: BuildOptions = {
  plugins: [
    graphqlLoaderPlugin({
      mapDocumentNode: optimizeDocumentNode,
    }),
  ],
};

export default buildOptions;
