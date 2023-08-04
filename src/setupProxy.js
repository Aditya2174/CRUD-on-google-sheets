// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/sheets',
    createProxyMiddleware({
      target: 'http://localhost:8081', // Update the target URL to match your backend
      changeOrigin: true,
    })
  );
};
