import { execFileSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artifact = path.join(root, '_site');
const agentctlCandidates = [
  process.env.AGENTCTL_REPO,
  path.resolve(root, '../agentctl'),
  path.resolve(root, '../../agentctl'),
].filter(Boolean);
let agentctlRoot;
for (const candidate of agentctlCandidates) {
  try {
    if ((await stat(path.join(candidate, 'Cargo.toml'))).isFile()) {
      agentctlRoot = path.resolve(candidate);
      break;
    }
  } catch {
    // Remote-only links remain eligible for HTTP checking.
  }
}

async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await files(absolute)));
    else if (entry.name.endsWith('.html')) result.push(absolute);
  }
  return result;
}

const urls = new Set();
for (const file of await files(artifact)) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/href="(https?:[^"#]+)(?:#[^"]*)?"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'));
    if (url.hostname === 'opensourceops.github.io') continue;
    const source = url.pathname.match(/^\/opensourceops\/agentctl\/(?:blob|edit)\/main\/(.+)$/);
    if (source && agentctlRoot) {
      try {
        const sourcePath = path.resolve(agentctlRoot, decodeURIComponent(source[1]));
        if (!sourcePath.startsWith(`${agentctlRoot}${path.sep}`)) throw new Error('path escape');
        if ((await stat(sourcePath)).isFile()) continue;
      } catch {
        // Let the public URL check report the missing source.
      }
    }
    const commit = url.pathname.match(/^\/opensourceops\/agentctl\/commit\/([0-9a-f]{40})$/);
    if (commit && agentctlRoot) {
      try {
        execFileSync('git', ['cat-file', '-e', `${commit[1]}^{commit}`], {
          cwd: agentctlRoot,
          stdio: 'ignore',
        });
        continue;
      } catch {
        // Let the public URL check report an unknown commit.
      }
    }
    url.hash = '';
    url.search = '';
    urls.add(url.toString());
  }
}

const failures = [];
const warnings = [];
const queue = [...urls];

async function check(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'opensourceops-docs-link-check/1.0',
        Range: 'bytes=0-1023',
      },
    });
    if ([404, 410].includes(response.status)) failures.push(`${response.status} ${url}`);
    else if (response.status >= 400 && ![401, 403, 429].includes(response.status)) {
      warnings.push(`${response.status} ${url}`);
    }
    await response.body?.cancel();
  } catch (error) {
    warnings.push(`${error.name}: ${url}`);
  } finally {
    clearTimeout(timeout);
  }
}

await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) await check(queue.shift());
  }),
);

if (warnings.length) console.warn(`External links not conclusively checked:\n${warnings.join('\n')}`);
if (failures.length) throw new Error(`Broken external links:\n${failures.join('\n')}`);
console.log(`External link check found no definite failures across ${urls.size} unique URLs.`);
