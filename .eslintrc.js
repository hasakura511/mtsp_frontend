module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "mocha": true,
    "node": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "no-const-assign": "warn",
    "no-this-before-super": "warn",
    "no-undef": "warn",
    "no-unreachable": "warn",
    "no-useless-escape": "warn",
    "no-unused-vars": "warn",
    "constructor-super": "warn",
    "valid-typeof": "warn",
    "no-console": "warn",
    "no-unsafe-finally": "warn",
    "no-process-env": "warn",
    "no-debugger": "warn",
    "react/display-name": [0, {
      "ignoreTranspilerName": true
    }]
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"]
};