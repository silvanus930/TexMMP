module.exports = {
  parser: 'babel-eslint',
  globals: {
    __DEV__: true,
  },
  env: {
    browser: true,
    jest: true,
  },
  extends: 'airbnb',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  rules: {
    'template-curly-spacing': 'off',
    indent: [
      'error',
      2,
      {
        ignoredNodes: ['TemplateLiteral'],
      },
    ],
    'react/jsx-filename-extension': [
      2,
      {extensions: ['.js', '.jsx', '.ts', '.tsx']},
    ],
    '@typescript-eslint/no-use-before-define': [0],
    // eslint-disable-next-line no-bitwise
    'react/function-component-definition': [
      0,
      {namedComponents: 'function-declaration' | 'function-expression'},
    ],
    'react-hooks/exhaustive-deps': 0,
    'react/jsx-props-no-spreading': 'off',
    'no-use-before-define': [2, {variables: false}],
    'no-unsafe-optional-chaining': [0],
    'max-len': 0,
    'import/extensions': 0,
    'import/no-unresolved': [0, {caseSensitive: false}],
    'no-underscore-dangle': [0, {allow: ['_place']}],
    'import/no-extraneous-dependencies': [
      0,
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'no-param-reassign': ['error', {props: false}],
    'react/no-unescaped-entities': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
