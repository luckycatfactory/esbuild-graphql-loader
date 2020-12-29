var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __assign = Object.assign;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true}), module2);
};

// src/index.ts
__export(exports, {
  default: () => src_default
});
var fs = __toModule(require("fs"));
var graphql_tag = __toModule(require("graphql-tag"));
var defaultOptions = {
  filterRegex: /\.graphql$/
};
var graphqlLoaderPlugin = (options = {}) => {
  const optionsWithDefaults = __assign(__assign({}, defaultOptions), options);
  return {
    name: "graphql-loader",
    setup(build) {
      build.onLoad({filter: optionsWithDefaults.filterRegex}, (args) => fs.default.promises.readFile(args.path).then((data) => ({
        contents: `export default ${JSON.stringify(graphql_tag.default(data.toString()))};`
      })));
    }
  };
};
var src_default = graphqlLoaderPlugin;
