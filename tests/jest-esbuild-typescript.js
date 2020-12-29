const { transformSync } = require("esbuild");

module.exports = {
  process(src) {
    const result = transformSync(src, {
      format: "cjs",
      loader: "ts",
    });

    return result;
  },
};
