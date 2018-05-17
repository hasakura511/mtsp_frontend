module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    mocha: true,
    node: true
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    sourceType: "module"
  },
  plugins: ["react", "flowtype"],
  rules: {
    "no-const-assign": "warn",
    "no-this-before-super": "warn",
    "no-undef": "warn",
    "no-unreachable": "warn",
    "no-useless-escape": "warn",
    "no-unused-vars": "warn",
    "constructor-super": "warn",
    "valid-typeof": "warn",
    "no-console": "warn",
    "no-unsafe-finally": 0,
    "no-process-env": 0,
    "no-debugger": "warn",
    "react/display-name": [
      0,
      {
        ignoreTranspilerName: true
      }
    ],
    "no-useless-escape": 0,
    "flowtype/boolean-style": [2, "boolean"],
    "flowtype/define-flow-type": 1,
    // "flowtype/delimiter-dangle": [2, "never"],
    "flowtype/delimiter-dangle": "warn",
    "flowtype/generic-spacing": [2, "never"],
    "flowtype/no-primitive-constructor-types": 2,
    "flowtype/no-types-missing-file-annotation": 2,
    "flowtype/no-weak-types": "warn",
    // "flowtype/object-type-delimiter": [2, "comma"],
    "flowtype/object-type-delimiter": "warn",
    "flowtype/require-parameter-type": 2,
    "flowtype/require-return-type": [
      2,
      "always",
      {
        annotateUndefined: "never"
      }
    ],
    "flowtype/require-valid-file-annotation": 2,
    "flowtype/semi": [2, "always"],
    "flowtype/space-after-type-colon": [2, "always"],
    "flowtype/space-before-generic-bracket": [2, "never"],
    "flowtype/space-before-type-colon": [2, "never"],
    "flowtype/type-id-match": [2, "^([A-Z][a-z0-9]+)+Type$"],
    "flowtype/union-intersection-spacing": [2, "always"],
    "flowtype/use-flow-type": 1,
    "flowtype/valid-syntax": 1
  },
  extends: ["eslint:recommended", "plugin:react/recommended"]
};
