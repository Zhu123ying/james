const { createProxyMiddleware } = require('http-proxy-middleware')

// 配置代理文件， 按照项目手动修改
module.exports = function (app) {
  app.use(
    '/api/',
    createProxyMiddleware({
      target: 'https://178.119.202.13',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      }
    })
  )
}
