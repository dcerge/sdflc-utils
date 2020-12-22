/*
    // 'plugin:@typescript-eslint/eslint-recommended',
    // 'plugin:@typescript-eslint/recommended',
    //'plugin:prettier/recommended',
    // 'prettier/@typescript-eslint',
    //'prettier/react',
    //'tslint-config-prettier'
*/
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'jest', '@typescript-eslint'],
  rules: {
    'filenames/match-regex': 'off',
    '@typescript-eslint/camelcase': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
    'react/display-name': [0, { ignoreTranspilerName: true }],
    'react/no-string-refs': 'off',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
