const CracoLessPlugin = require('craco-less')
const path = require('path')
const ROOT_PATH = path.resolve(__dirname, '../')
const DIST_PATH = ROOT_PATH + '/dist'
const { whenDev } = require("@craco/craco")
const packageName = require('./package.json').name
const publicPath = whenDev ? '/' : '/childapp/front/static/'

module.exports = {
  devServer: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  webpack: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      "pages": path.resolve(__dirname, 'src', 'pages'),
      "assets": path.resolve(__dirname, 'src', 'assets'),
      "components": path.resolve(__dirname, 'src', 'components'),
      "utils": path.resolve(__dirname, 'src', 'utils'),
      "http": path.resolve(__dirname, 'src', 'http'),
      "ultraui": '@huayun/ultraui'
    },
    configure: {
      output: {
        // path: DIST_PATH + publicPath,
        filename: '[name].[hash].js',
        publicPath: publicPath,
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
  ]
}
