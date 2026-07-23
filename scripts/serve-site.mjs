import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../_site');
const port = Number(process.env.AGENTCTL_DOCS_PORT || '4173');
const types = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.wasm', 'application/wasm'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

async function resolveRequest(pathname) {
  const decoded = decodeURIComponent(pathname);
  const normalized = path.posix.normalize(decoded);
  if (!normalized.startsWith('/')) return;
  let candidate = path.join(root, normalized);
  if (!candidate.startsWith(root)) return;
  try {
    const details = await stat(candidate);
    if (details.isDirectory()) candidate = path.join(candidate, 'index.html');
    await stat(candidate);
    return candidate;
  } catch {
    if (!path.extname(candidate)) {
      try {
        const index = path.join(candidate, 'index.html');
        await stat(index);
        return index;
      } catch {
        return;
      }
    }
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || '127.0.0.1'}`);
  if (url.pathname === '/agentctl') {
    response.writeHead(308, { location: '/agentctl/' });
    response.end();
    return;
  }
  const file = await resolveRequest(url.pathname);
  const status = file ? 200 : 404;
  const target = file || path.join(root, '404.html');
  response.writeHead(status, {
    'content-type': types.get(path.extname(target)) || 'application/octet-stream',
    'cache-control': 'no-store',
  });
  if (request.method === 'HEAD') response.end();
  else createReadStream(target).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving final Pages artifact at http://127.0.0.1:${port}/agentctl/`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
