import { Plugin } from 'esbuild';
import { DocumentNode } from 'graphql';
interface GraphQLLoaderPluginOptions {
    filterRegex?: RegExp;
    mapDocumentNode?: (documentNode: DocumentNode) => DocumentNode;
}
export declare const generateGraphQLString: (entryPointPath: string) => Promise<string>;
export declare const generateContentsFromGraphqlString: (graphqlString: string, mapDocumentNode?: ((documentNode: DocumentNode) => DocumentNode) | undefined) => string;
declare const graphqlLoaderPlugin: (options?: GraphQLLoaderPluginOptions) => Plugin;
export default graphqlLoaderPlugin;
