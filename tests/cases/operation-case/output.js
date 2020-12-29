// tests/cases/operation-case/target.graphql
var target_default = {kind: "Document", definitions: [{kind: "OperationDefinition", operation: "query", name: {kind: "Name", value: "getPosts"}, variableDefinitions: [], directives: [], selectionSet: {kind: "SelectionSet", selections: [{kind: "Field", alias: void 0, name: {kind: "Name", value: "posts"}, arguments: [], directives: [], selectionSet: {kind: "SelectionSet", selections: [{kind: "Field", alias: void 0, name: {kind: "Name", value: "id"}, arguments: [], directives: [], selectionSet: void 0}]}}]}}], loc: {start: 0, end: 40}};

// tests/cases/operation-case/index.ts
var operation_case_default = target_default;
export {
  operation_case_default as default
};
