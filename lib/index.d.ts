import { Plugin } from 'esbuild';
interface GraphQLLoaderPluginOptions {
    filterRegex: RegExp;
}
declare const graphqlLoaderPlugin: (options?: Partial<GraphQLLoaderPluginOptions>) => Plugin;
export default graphqlLoaderPlugin;
