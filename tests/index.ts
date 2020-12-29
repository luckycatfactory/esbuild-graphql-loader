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
// For now, these tests just build up all the fixture cases and check that the
// outputs match the expected outputs. Pretty primitive stuff, but it works.
// This is really far from ideal.

interface TestCase {
  buildOptions: BuildOptions;
  entryPath: string;
  expectedPath: string;
  graphqlPath: string;
  outfilePath: string;
}

const fixturesPath = path.join(__dirname, "./fixtures");

const defaultBuildOptions = {
  bundle: true,
  plugins: [graphqlLoaderPlugin()],
};

const generateTestCase = (file: string): TestCase => {
  const casePath = path.join(fixturesPath, file);
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
    outfilePath: path.join(casePath, "actual.js"),
  };
};

const generateTestCases = (testFolders: string[]): TestCase[] =>
  testFolders.map(generateTestCase);

const generateActualContent = (testCases: TestCase[]) =>
  Promise.all(
    testCases.map((testCase) =>
      build({
        entryPoints: [testCase.entryPath],
        plugins: [graphqlLoaderPlugin()],
        outfile: testCase.outfilePath,
        ...testCase.buildOptions,
      })
    )
  ).then(() => testCases);

const getFileContents = (inputPath: string): Promise<string> =>
  fs.promises.readFile(inputPath).then((file) => file.toString());

const getExpectedContent = (testCase: TestCase): Promise<string> =>
  getFileContents(testCase.expectedPath);

const getActualContent = (testCase: TestCase): Promise<string> =>
  getFileContents(testCase.outfilePath);

const runTestCase = (testCase: TestCase): Promise<void> =>
  getExpectedContent(testCase)
    .then((expectedContent) =>
      getActualContent(testCase).then((actualContent) => ({
        actualContent,
        expectedContent,
      }))
    )
    .then(({ actualContent, expectedContent }) => {
      if (actualContent !== expectedContent) {
        throw new Error(
          `Actual content did match the expected content for ${testCase.entryPath}`
        );
      }
      console.log(`Test passed: ${testCase.entryPath}`);
    });

const runTestCases = (testCases: TestCase[]): Promise<void[]> =>
  Promise.all(testCases.map(runTestCase));

fs.promises
  .readdir(fixturesPath)
  .then(generateTestCases)
  .then(generateActualContent)
  .then(runTestCases)
  .then(() => {
    console.log("🎉 All tests passed!");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
