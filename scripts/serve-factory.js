#!/usr/bin/env node
// Minimal static file server for factory/<template>/ local testing (no deps).
// Usage: node scripts/serve-factory.js [template] [port]
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const template = process.argv[2] || 'win100';
const PORT = Number(process.argv[3] || process.env.PORT || 4173);
const ROOT = path.join(__dirname, '..', 'factory', template);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(ROOT, reqPath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found: ' + reqPath); return; }
    const ext = path.extname(filePath).toLowerCase();
    let type = MIME[ext];
    if (!type && reqPath.indexOf('/_external/') !== -1) type = 'image/jpeg';
    if (!type) type = 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`serving ${ROOT} at http://localhost:${PORT}`);
});
