const presets = [
    [
      '@babel/preset-env',
      {
        modules: false,
        loose: true,
        targets: {
          edge: '8',
          firefox: '40',
          chrome: '30',
          safari: '6',
        },
        useBuiltIns: 'usage',
      },
    ],
    [
      '@babel/preset-react'
    ],
  ];
  
  const plugins = [
    ["syntax-dynamic-import"],
    ['babel-plugin-import', {
      'libraryName': 'antd',
      'libraryDirectory': 'es',
      'style': 'css'
    }],
    [
      '@babel/plugin-transform-runtime',
      {
        'corejs': false,
        'helpers': false,
        'regenerator': true,
        'useESModules': false
      }
    ],
    ['@babel/plugin-transform-regenerator'],
    ['@babel/plugin-proposal-object-rest-spread'],
    ['@babel/plugin-proposal-class-properties'],
  ];
  
  module.exports = { presets, plugins };