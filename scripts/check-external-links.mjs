import { execFileSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { externalLinkStatus } from './external-link-status.mjs';

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
const checkedSourceObjects = new Set();
for (const file of await files(artifact)) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/href="(https?:[^"#]+)(?:#[^"]*)?"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'));
    if (url.hostname === 'opensourceops.github.io') continue;
    const source = url.pathname.match(/^\/opensourceops\/agentctl\/(?:blob|edit|tree)\/(main|[0-9a-f]{40})(?:\/(.+))?$/);
    if (source && agentctlRoot) {
      try {
        const relative = decodeURIComponent(source[2] || '');
        if (relative.split('/').includes('..')) throw new Error('path escape');
        if (source[1] === 'main') {
          const sourcePath = path.resolve(agentctlRoot, relative);
          if (!sourcePath.startsWith(`${agentctlRoot}${path.sep}`)) throw new Error('path escape');
          if ((await stat(sourcePath)).isFile()) continue;
        } else {
          const object = relative ? `${source[1]}:${relative}` : `${source[1]}^{tree}`;
          execFileSync('git', ['cat-file', '-e', object], { cwd: agentctlRoot, stdio: 'ignore' });
          checkedSourceObjects.add(object);
          continue;
        }
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
  try {
    const status = await externalLinkStatus(url);
    if ([404, 410].includes(status)) failures.push(`${status} ${url}`);
    else if (status >= 400 && ![401, 403, 429].includes(status)) {
      warnings.push(`${status} ${url}`);
    }
  } catch (error) {
    warnings.push(`${error.name}: ${url}`);
  }
}

await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) await check(queue.shift());
  }),
);

if (warnings.length) console.warn(`External links not conclusively checked:\n${warnings.join('\n')}`);
if (failures.length) throw new Error(`Broken external links:\n${failures.join('\n')}`);
console.log(`Verified ${checkedSourceObjects.size} exact source objects locally. External link check found no definite failures across ${urls.size} remaining unique URLs.`);
