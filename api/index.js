const { createProxyMiddleware } = require("http-proxy-middleware");

// 初始化代理中间件
const apiProxy = createProxyMiddleware({
  target: "https://generativelanguage.googleapis.com",
  changeOrigin: true,
  pathRewrite: {
    // 保持原路径透传，不做任何修改
    // 访问 /v1beta/models... -> 转发到 target/v1beta/models...
  },
  onProxyReq: (proxyReq, req, res) => {
    // 移除可能暴露 IP 的请求头
    proxyReq.removeHeader("x-forwarded-for");
    proxyReq.removeHeader("x-real-ip");
    proxyReq.removeHeader("via");
  },
  onProxyRes: (proxyRes, req, res) => {
    // 允许跨域
    proxyRes.headers["Access-Control-Allow-Origin"] = "*";
  },
});

// Vercel Serverless Function 入口
module.exports = (req, res) => {
  apiProxy(req, res, (result) => {
    if (result instanceof Error) {
      throw result;
    }
  });
};
