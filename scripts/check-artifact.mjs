import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artifact = path.join(root, '_site');
const required = [
  'index.html', '.nojekyll', '404.html', 'robots.txt', 'agentctl/index.html',
  'agentctl/404.html', 'agentctl/getting-started/index.html',
  'agentctl/reference/cli/index.html', 'agentctl/troubleshooting/index.html',
  'agentctl/pagefind/pagefind.js', 'agentctl/meta/agentctl-source.json',
  'agentctl/downloads/workflow.schema.json',
];

for (const relative of required) {
  try { await stat(path.join(artifact, relative)); }
  catch { throw new Error(`Missing required artifact path: ${relative}`); }
}

async function htmlFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await htmlFiles(absolute)));
    else if (entry.name.endsWith('.html')) result.push(absolute);
  }
  return result;
}

const files = await htmlFiles(artifact);
const records = new Map();
for (const file of files) {
  const html = await readFile(file, 'utf8');
  records.set(file, {
    html,
    ids: new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])),
    links: new Set(),
  });
}

const errors = [];
for (const [file, record] of records) {
  const relative = path.relative(artifact, file);
  if (record.html.includes('/Users/')) errors.push(`${relative}: absolute local path`);
  if (record.html.includes('http://localhost')) errors.push(`${relative}: localhost canonical or link`);

  for (const match of record.html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (value.startsWith('$')) continue;
    if (/^(?:https?:|mailto:|data:|javascript:|\/\/)/.test(value)) continue;

    const [rawPath, rawFragment = ''] = value.split('#', 2);
    const clean = rawPath.split('?', 1)[0];
    let target = file;
    if (clean) {
      try {
        target = clean.startsWith('/')
          ? path.join(artifact, decodeURI(clean))
          : path.resolve(path.dirname(file), decodeURI(clean));
      } catch {
        errors.push(`${relative}: invalid encoded path ${value}`);
        continue;
      }
    }

    try {
      const details = await stat(target);
      if (details.isDirectory()) target = path.join(target, 'index.html');
      await stat(target);
    } catch {
      errors.push(`${relative}: broken internal asset or link ${value}`);
      continue;
    }

    if (!target.endsWith('.html')) continue;
    record.links.add(target);
    if (rawFragment && !rawFragment.startsWith(':~:text=')) {
      let fragment;
      try { fragment = decodeURIComponent(rawFragment); }
      catch {
        errors.push(`${relative}: invalid encoded anchor ${value}`);
        continue;
      }
      const targetRecord = records.get(target);
      if (targetRecord && !targetRecord.ids.has(fragment)) {
        errors.push(`${relative}: broken anchor ${value}`);
      }
    }
  }
}

const reachable = new Set();
const queue = [path.join(artifact, 'index.html'), path.join(artifact, 'agentctl/index.html')];
while (queue.length) {
  const file = queue.shift();
  if (reachable.has(file)) continue;
  reachable.add(file);
  for (const link of records.get(file)?.links || []) {
    if (records.has(link) && !reachable.has(link)) queue.push(link);
  }
}

for (const file of records.keys()) {
  if (file.endsWith(`${path.sep}404.html`)) continue;
  if (!reachable.has(file)) errors.push(`${path.relative(artifact, file)}: orphan page`);
}

if (errors.length) throw new Error(errors.slice(0, 100).join('\n'));
console.log(`Artifact structure, routes, ${files.length} HTML pages, links, anchors, and reachability passed.`);
