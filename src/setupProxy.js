const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    ["/check-login", "/new-lobby", "/ping"].forEach((path) => {
        app.use(
            path,
            createProxyMiddleware({
                target: 'https://secret-hitler-online.fly.dev' + path,
                changeOrigin: true,
                ws: true
            })
        );
    })
    app.use(
        "/game",
        createProxyMiddleware({
            target: 'https://secret-hitler-online.fly.dev/game',
            changeOrigin: true,
            ws: true,
            secure: true,
            xfwd: true,
    //          onProxyReqWs: (proxyReq) => {
    //     proxyReq.setHeader('Origin', 'https://secret-hitler-online.fly.dev');
    //   }
        })
    );
};