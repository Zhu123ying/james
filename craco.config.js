const CracoLessPlugin = require('craco-less')
const path = require('path')
const packageName = require('./package.json').name
const SRC_PATH = path.resolve(__dirname, 'src')
module.exports = {
  devServer: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  webpack: {
    alias: {
      '~': SRC_PATH,
      'Actn': SRC_PATH + '/actions',
      'Cmpt': SRC_PATH + '/components',
      'Cnst': SRC_PATH + '/constants',
      'Page': SRC_PATH + '/pages',
      'Redu': SRC_PATH + '/reducers',
      'Stor': SRC_PATH + '/store',
      'Img': SRC_PATH + '/images',
      'Style': SRC_PATH + '/style',
      'Utils': SRC_PATH + '/utils',
      'CSS': SRC_PATH + '/css',
      'MidWare': SRC_PATH + '/middlewares/reduxFetchMiddleware',
      'Libs': SRC_PATH + '/libs',
      'Models': SRC_PATH + '/models',
      'Hooks': SRC_PATH + '/hooks',
      'Adv': SRC_PATH + '/pages/advancedComponents',
      'ultraui': '@huayun/ultraui'
    },
    configure: {
      output: {
        filename: '[name].[hash].js',
        publicPath: '/application/',
        libraryTarget: 'umd',
        library: `${packageName}-[name]`,
        jsonpFunction: `webpackJsonp_${packageName}`
      }
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true
          }
        }
      }
    }
  ],
  babel: {
    // 支持装饰器模式语法
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }]
    ]
  }
}
