# `esbuild-graphql-loader`

[![npm version](https://badge.fury.io/js/%40luckycatfactory%2Fesbuild-graphql-loader.svg)](https://badge.fury.io/js/%40luckycatfactory%2Fesbuild-graphql-loader)

This is a zero-dependency [esbuild](https://github.com/evanw/esbuild) plugin that allows for the importing of GraphQL files.

## Requirements

This packages requires at least the following for `esbuild`:

```
>=0.8.26
```

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
import { build } from 'esbuild';
import graphqlLoaderPlugin from '@luckycatfactory/esbuild-graphql-loader';

build({
  ...otherOptions,
  plugins: [graphqlLoaderPlugin()],
}).catch(() => {
  process.exit(1);
});
```

With this in place, you should now be able to import GraphQL like so:

```ts
import schema from './schema.graphql';

// Do whatever with the schema DocumentNode...
```

Also, all operations are named exports, so you can do things like this:

```ts
import {
  QueryA,
  QueryB,
  MutationA,
  SubscriptionA,
} from './my-operations.graphql';

// Do whatever with those operations...
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

Valid import comments are prefixed either with `#import ` or `# import ` and have a suffix of a path relative from the GraphQL file's path.

### Recommendations

#### Optimize Your DocumentNodes

You can shave a bit off your bundle size by optimizing your `DocumentNode` instances with tools like [@graphql-tools/optimize](https://www.graphql-tools.com/docs/api/modules/optimize) through the [mapDocumentNode configuration option](https://github.com/luckycatfactory/esbuild-graphql-loader#mapdocumentnode).

## Configuration

Some configuration options are available at plugin instantiation.

### `filterRegex`

This is the regex used to determine the files that are matches as GraphQL files.
By default, this regex is `/\.graphql$/`.
Here is how you can override that value:

```ts
import { build } from 'esbuild';
import graphqlLoaderPlugin from '@luckycatfactory/esbuild-graphql-loader';

build({
  ...otherOptions,
  plugins: [graphqlLoaderPlugin({ filterRegex: /\.gql$/ })],
}).catch(() => {
  process.exit(1);
});
```

### `mapDocumentNode`

This is an optional function that you can supply to map all `DocumentNode` instances before they're resolved.
An example of this would be:

```ts
import { build } from 'esbuild';
import graphqlLoaderPlugin from '@luckycatfactory/esbuild-graphql-loader';
import { optimizeDocumentNode } from '@graphql-tools/optimize';

build({
  ...otherOptions,
  plugins: [
    graphqlLoaderPlugin({
      mapDocumentNode: (documentNode: DocumentNode) =>
        optimizeDocumentNode(documentNode),
    }),
  ],
}).catch(() => {
  process.exit(1);
});
```
