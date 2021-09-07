/* eslint-disable import/extensions */
/* eslint-disable global-require */
module.exports = {
  extends: [
    'airbnb-base',
    'plugin:node/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    es6: true,
    commonjs: true,
    node: true,
  },
  plugins: ['prettier'],
  parserOptions: {
    ecmaFeatures: {
      ecmaVersion: 6,
      sourceType: 'module',
      impliedStrict: true,
    },
  },
  rules: {
    'consistent-return': 0,
    'node/exports-style': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    complexity: [2, { max: 8 }],
    'max-depth': [2, { max: 3 }],
    'node/file-extension-in-import': [2, 'never'],
    'prettier/prettier': ['error', require('./.prettierrc.js')],
    'func-names': ['error', 'never'],
  },
};
