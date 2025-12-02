// api/index.js
const { createProxyMiddleware } = require("http-proxy-middleware");

const apiProxy = createProxyMiddleware({
  target: "https://generativelanguage.googleapis.com",
  changeOrigin: true,
  pathRewrite: {
    "^/": "/", // 保持路径透传
  },
  onProxyReq: (proxyReq, req, res) => {
    // 移除可能暴露 IP 的头
    proxyReq.removeHeader("x-forwarded-for");
    proxyReq.removeHeader("x-real-ip");
  },
});

module.exports = (req, res) => {
  apiProxy(req, res, (result) => {
    if (result instanceof Error) {
      throw result;
    }
  });
};
