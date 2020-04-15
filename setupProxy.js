const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  console.log("Setting up proxy url's on development server");
  app.use(
    '/api-admin/v1',
    createProxyMiddleware({
      target: 'http://localhost:8086/',
      changeOrigin: true,
    })
  );
};