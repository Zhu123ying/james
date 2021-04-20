const { createProxyMiddleware } = require('http-proxy-middleware')

// 配置代理文件， 按照项目手动修改
module.exports = function (app) {
  app.use(
    '/api/',
    createProxyMiddleware({
      target: 'https://172.118.59.90',
      secure: false,
      changeOrigin: true
    })
  )
}
