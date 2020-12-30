import { Plugin } from 'esbuild';
import { DocumentNode } from 'graphql';
interface GraphQLLoaderPluginOptions {
    filterRegex?: RegExp;
    mapDocumentNode?: (documentNode: DocumentNode) => DocumentNode;
}
declare const graphqlLoaderPlugin: (options?: GraphQLLoaderPluginOptions) => Plugin;
export default graphqlLoaderPlugin;
