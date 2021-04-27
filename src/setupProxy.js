const { createProxyMiddleware } = require('http-proxy-middleware')

// 配置代理文件， 按照项目手动修改
module.exports = function (app) {
  app.use(
    '/api/',
    createProxyMiddleware({
      target: 'http://178.104.163.190:8008',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  )
}
