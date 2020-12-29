import { build, Format } from "esbuild";

const formats: Format[] = ["cjs", "esm"];

Promise.all(
  formats.map((format) =>
    build({
      bundle: true,
      entryPoints: ["src/index.ts"],
      external: ["graphql-tag"],
      format,
      outfile: format === "cjs" ? "lib/index.js" : "lib/index.mjs",
      platform: "node",
      target: ["node8.0.0"],
    })
  )
).catch(() => {
  process.exit(1);
});
