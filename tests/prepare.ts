import { build, BuildOptions } from "esbuild";
import graphqlLoaderPlugin from "../src";
import fs from "fs";
import path from "path";

// I originally attempted to write traditional Jest tests, utilizing the build
// API with write: false, but I encountered some go-level interface coercion
// problems around this line:
//
// https://github.com/evanw/esbuild/blob/150a01844d47127c007c2b1973158d69c560ca21/cmd/esbuild/service.go#L478
//
// For now, these tests are dependent on this prepare script. Once it's run, the
// we can then run the Jest tests that are dependent on the generated files
// being present.

process.on("unhandledRejection", (reason, p) => {
  throw reason;
});

interface TestCase {
  buildOptions: BuildOptions;
  entryPath: string;
  expectedPath: string;
  graphqlPath: string;
  outfilePath: string;
}

const casesPath = path.join(__dirname, "./cases");

const defaultBuildOptions = {
  bundle: true,
  plugins: [graphqlLoaderPlugin()],
};

interface FileSystemPathStats {
  path: string;
  isDirectory: boolean;
}

const getTestFolders = (): Promise<string[]> =>
  fs.promises.readdir(casesPath).then((entityPaths) =>
    Promise.all(
      entityPaths.map((entityPath) =>
        fs.promises.lstat(path.join(casesPath, entityPath)).then((stats) => {
          const fileSystemPathStats: FileSystemPathStats = {
            path: entityPath,
            isDirectory: stats.isDirectory(),
          };
          return fileSystemPathStats;
        })
      )
    ).then((fileSystemPathStatsCollection) =>
      fileSystemPathStatsCollection.reduce<string[]>(
        (accumulator, fileSystemPathStats) => {
          if (fileSystemPathStats.isDirectory) {
            accumulator.push(fileSystemPathStats.path);
          }
          return accumulator;
        },
        []
      )
    )
  );

const generateTestCase = (file: string): TestCase => {
  const casePath = path.join(casesPath, file);
  const buildOptionsPath = path.join(casePath, "buildOptions.ts");

  const buildOptionsOverrides: Partial<BuildOptions> = fs.existsSync(
    buildOptionsPath
  )
    ? require(buildOptionsPath).default
    : {};

  return {
    buildOptions: { ...defaultBuildOptions, ...buildOptionsOverrides },
    entryPath: path.join(casePath, "index.ts"),
    expectedPath: path.join(casePath, "expected.js"),
    graphqlPath: path.join(casePath, "target.graphql"),
    outfilePath: path.join(casePath, "output.js"),
  };
};

const generateTestCases = (testFolders: string[]): TestCase[] =>
  testFolders.map(generateTestCase);

const generateActualContent = (testCases: TestCase[]) =>
  Promise.all(
    testCases.map((testCase) =>
      build({
        entryPoints: [testCase.entryPath],
        format: "esm",
        plugins: [graphqlLoaderPlugin()],
        outfile: testCase.outfilePath,
        ...testCase.buildOptions,
      })
    )
  ).then(() => testCases);

getTestFolders()
  .then(generateTestCases)
  .then(generateActualContent)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
