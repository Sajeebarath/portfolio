import { createServer } from 'node:http';
import { readdir, readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { renderPage } from './render.js';

const assets = new URL('../assets/', import.meta.url);
const files = new Set((await readdir(assets, { withFileTypes: true }))
  .filter(entry => entry.isFile()).map(entry => '/assets/' + entry.name));
const types = { '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.pdf': 'application/pdf' };
const port = Number(process.env.PORT || 3000);

createServer(async (request, response) => {
  try {
    const path = new URL(request.url, 'http://localhost').pathname;
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    if (path === '/' || path === '/index.html') {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        .end(request.method === 'HEAD' ? undefined : await renderPage());
    } else if (files.has(path)) {
      const bytes = await readFile(new URL('..' + path, import.meta.url));
      const headers = { 'Content-Type': types[extname(path)] };
      if (path === '/assets/Sajeebarath_Suntharalingam_CV.pdf') {
        headers['Content-Disposition'] = 'attachment; filename="Sajeebarath_Suntharalingam_CV.pdf"';
      }
      response.writeHead(200, headers).end(request.method === 'HEAD' ? undefined : bytes);
    } else {
      response.writeHead(404).end();
    }
  } catch {
    if (!response.headersSent) response.writeHead(500);
    response.end();
  }
}).listen(port, '127.0.0.1', () => console.log('Portfolio: http://localhost:' + port));
