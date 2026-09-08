import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import test from 'node:test';
import { externalLinkStatus } from './external-link-status.mjs';

async function withServer(handler, check) {
  const server = http.createServer(handler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    await check(origin);
  } finally {
    // Await natural connection cleanup; do not force-close sockets to make
    // the test pass when the checker leaves a response alive.
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test('follows relative redirects and preserves a definite missing-link status', { timeout: 2000 }, async () => {
  await withServer((request, response) => {
    assert.equal(request.headers.range, 'bytes=0-1023');
    assert.equal(request.headers.connection, 'close');
    if (request.url === '/start') response.writeHead(302, { location: '/missing' }).end();
    else response.writeHead(404).end();
  }, async (origin) => assert.equal(await externalLinkStatus(`${origin}/start`), 404));
});

test('closes a successful response without waiting for its unfinished body', { timeout: 2000 }, async () => {
  await withServer((_request, response) => {
    response.writeHead(200);
    response.flushHeaders();
  }, async (origin) => assert.equal(await externalLinkStatus(origin), 200));
});

test('bounds a server that never sends response headers', { timeout: 2000 }, async () => {
  await withServer(() => {}, async (origin) => {
    await assert.rejects(externalLinkStatus(origin, { timeoutMs: 50 }), { name: 'AbortError' });
  });
});

test('bounds a redirect cycle and closes its connections', { timeout: 2000 }, async () => {
  let requests = 0;
  await withServer((_request, response) => {
    requests += 1;
    response.writeHead(307, { location: '/again' }).end();
  }, async (origin) => {
    await assert.rejects(externalLinkStatus(origin), /exceeded 20 redirects/);
    assert.equal(requests, 21);
  });
});
