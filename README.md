# `esbuild-graphql-loader`

This is an [esbuild](https://github.com/evanw/esbuild) plugin that allows for the importing of GraphQL files.

## Usage

To install this package:

```sh
npm install --save @luckycatfactory/esbuild-graphql-loader
```

```sh
yarn add @luckycatfactory/esbuild-graphql-loader
```

Then, use the plugin like so:

```ts
import { build } from "esbuild";
import graphqlLoaderPlugin from "@luckycatfactory/esbuild-graphql-loader";

build({
  ...otherOptions,
  plugins: [graphqlLoaderPlugin()],
}).catch(() => {
  process.exit(1);
});
```

## Configuration

Some configuration options are available at plugin instantiation.

### `filterRegex`

This is the regex used to determine the files that are matches as GraphQL files.
By default, this regex is `/\.graphql$/`.
Here is how you can override that value:

```ts
import { build } from "esbuild";
import graphqlLoaderPlugin from "@luckycatfactory/esbuild-graphql-loader";

build({
  ...otherOptions,
  plugins: [graphqlLoaderPlugin({ filterRegex: /\.gql$/ })],
}).catch(() => {
  process.exit(1);
});
```
