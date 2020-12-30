# `esbuild-graphql-loader`

[![npm version](https://badge.fury.io/js/%40luckycatfactory%2Fesbuild-graphql-loader.svg)](https://badge.fury.io/js/%40luckycatfactory%2Fesbuild-graphql-loader)

This is an [esbuild](https://github.com/evanw/esbuild) plugin that allows for the importing of GraphQL files.

## Usage

To install this package:

```sh
npm install --save @luckycatfactory/esbuild-graphql-loader esbuild graphql-tag
```

```sh
yarn add @luckycatfactory/esbuild-graphql-loader esbuild graphql-tag
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

### GraphQL File Imports

You can import files from within GraphQL files by using imports in comments like so:

```gql
#import ./user.graphql

type Post {
  author: User!
  name: String!
}
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
