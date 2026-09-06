import http from 'node:http';
import https from 'node:https';

const redirects = new Set([301, 302, 303, 307, 308]);

function requestHeaders(url, signal) {
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('External link must use HTTP(S) without URL credentials');
  }
  const client = url.protocol === 'https:' ? https : http;
  return new Promise((resolve, reject) => {
    const request = client.request(url, {
      method: 'GET',
      agent: false,
      signal,
      headers: {
        'User-Agent': 'opensourceops-docs-link-check/1.0',
        Range: 'bytes=0-1023',
      },
    }, (response) => {
      const result = { status: response.statusCode, location: response.headers.location };
      // Link checks need headers only. Destroy this unpooled connection even
      // when the server ignores Range or leaves its response body unfinished.
      response.destroy();
      resolve(result);
    });
    request.once('error', reject);
    request.end();
  });
}

export async function externalLinkStatus(address, { timeoutMs = 15_000 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let url = new URL(address);
    for (let followed = 0; followed <= 20; followed += 1) {
      const result = await requestHeaders(url, controller.signal);
      if (!redirects.has(result.status) || !result.location) return result.status;
      if (followed === 20) throw new Error('External link exceeded 20 redirects');
      url = new URL(result.location, url);
    }
  } finally {
    controller.abort();
    clearTimeout(timeout);
  }
}
