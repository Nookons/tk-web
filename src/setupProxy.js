const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/athena',
        createProxyMiddleware({
            target: 'http://10.46.143.3',
            changeOrigin: true,
        })
    );
};