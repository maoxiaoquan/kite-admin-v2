const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    proxy('/api-admin/v1', {
      target: 'http://localhost:8086/',
      secure: false,
      changeOrigin: true
    }),

    proxy('/default', {
      target: 'http://localhost:8086/',
      secure: false,
      changeOrigin: true
    }),
    proxy('/upload', {
      target: 'http://localhost:8086/',
      secure: false,
      changeOrigin: true
    })
  )
}