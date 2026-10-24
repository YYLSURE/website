/* 人格旅行网页版 · 零依赖静态服务器（Node >= 14） */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 8088;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // 非静态资源请求统一回退到 index.html（兼容前端路由）
        fs.readFile(path.join(ROOT, 'index.html'), (e2, html) => {
          if (e2) {
            res.writeHead(404);
            res.end('Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': MIME['.html'] });
            res.end(html);
          }
        });
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
      res.end(data);
    });
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`[personality-travel-web] running at http://127.0.0.1:${PORT}`);
  });
