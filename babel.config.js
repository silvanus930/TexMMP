module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        alias: {
          component: './src/component',
          screen: './src/screen',
          res: './src/res',
          src: './src',
          utils: './src/utils',
        },
      },
    ],
  ],
  env: {
    production: {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [
        ['babel-plugin-transform-remove-console'],
        'react-native-reanimated/plugin',
      ],
    },
  },
};
