import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentManifest } from './content-manifest.mjs';
import { publicBrandingIssues, visibleHtmlText } from './public-branding.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artifact = path.join(root, '_site');
const required = [
  'index.html', '.nojekyll', '404.html', 'robots.txt', 'agentctl/index.html',
  'agentctl/404.html', 'agentctl/getting-started/index.html',
  'agentctl/reference/cli/index.html', 'agentctl/troubleshooting/index.html',
  'agentctl/pagefind/pagefind.js', 'agentctl/meta/agentctl-source.json',
  'agentctl/downloads/workflow.schema.json',
  'agentctl/downloads/devops/catalog.json',
  'agentctl/downloads/remediation/catalog.json',
  'agentctl/downloads/remediation/21-container-remediation.zip',
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
for (const [file, { html }] of records) {
  for (const [tag] of html.matchAll(/<pre\b[^>]*\bdata-language="[^"]*"[^>]*>/g)) {
    if (!/\btabindex="0"/.test(tag)) errors.push(`${file}: code block lacks initial keyboard access`);
  }
}
const sourceMetadata = await readFile(path.join(root, 'src/data/agentctl-source.json'), 'utf8');
const artifactMetadata = await readFile(path.join(artifact, 'agentctl/meta/agentctl-source.json'), 'utf8');
if (artifactMetadata !== sourceMetadata) errors.push('built source metadata differs from synchronized metadata');
const source = JSON.parse(artifactMetadata);
if (!/^[0-9a-f]{40}$/.test(source.commit) || typeof source.dirty !== 'boolean') {
  errors.push('source metadata lacks a valid commit and working-tree status');
}
if (source.importedFiles !== contentManifest.length || source.imports?.length !== contentManifest.length) {
  errors.push('source metadata does not cover the complete import manifest');
}
const packages = JSON.parse(await readFile(path.join(artifact, 'agentctl/downloads/devops/catalog.json'), 'utf8'));
if (packages.length !== 20 || JSON.stringify(packages) !== JSON.stringify(source.cookbookPackages)) {
  errors.push('download catalog must cover all twenty source-matched packages');
}
for (const item of packages) {
  const bytes = await readFile(path.join(artifact, item.download));
  if (item.sourceCommit !== source.commit || item.bytes !== bytes.length || item.sha256 !== createHash('sha256').update(bytes).digest('hex')) {
    errors.push(`stale or mismatched cookbook package: ${item.directory}`);
  }
  if (!records.has(path.join(artifact, item.route, 'index.html'))) errors.push(`package has no tutorial: ${item.directory}`);
}
const remediationPackages = JSON.parse(await readFile(path.join(artifact, 'agentctl/downloads/remediation/catalog.json'), 'utf8'));
if (remediationPackages.length !== 1 || JSON.stringify(remediationPackages[0]) !== JSON.stringify(source.remediationPackage)) {
  errors.push('remediation download must match its independent source metadata');
}
for (const item of remediationPackages) {
  const bytes = await readFile(path.join(artifact, item.download));
  if (item.sourceCommit !== source.commit || item.bytes !== bytes.length || item.sha256 !== createHash('sha256').update(bytes).digest('hex')) {
    errors.push('stale or mismatched remediation package');
  }
  if (!records.has(path.join(artifact, item.route, 'index.html'))) errors.push('remediation package has no tutorial');
}
for (const [sourcePath, target] of contentManifest) {
  const imported = source.imports?.filter((item) => item.source === sourcePath) || [];
  if (imported.length !== 1) {
    errors.push(`source metadata must contain exactly one entry for ${sourcePath}`);
    continue;
  }
  const slug = target.replace(/^_generated\//, '').replace(/\.md$/, '').replace(/\/index$/, '');
  const route = `/agentctl/${slug ? `${slug}/` : ''}`;
  const content = await readFile(path.join(root, 'src/content/docs', target));
  const digest = createHash('sha256').update(content).digest('hex');
  if (imported[0].route !== route || imported[0].contentSha256 !== digest) {
    errors.push(`source metadata has a stale route or content digest for ${sourcePath}`);
  }
  if (!records.has(path.join(artifact, route, 'index.html'))) {
    errors.push(`imported page is missing from final artifact: ${route}`);
  }
}
for (const [file, record] of records) {
  const relative = path.relative(artifact, file);
  for (const issue of publicBrandingIssues(visibleHtmlText(record.html))) errors.push(`${relative}: ${issue}`);
  if (record.html.includes('Canonical source:')) errors.push(`${relative}: rendered source boilerplate`);
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
execFileSync('python3', [path.join(root, 'scripts/check-cookbook-packages.py')], { stdio: 'inherit' });
execFileSync('python3', [path.join(root, 'scripts/check-remediation-package.py')], { stdio: 'inherit' });
console.log(`Artifact structure, routes, ${files.length} HTML pages, links, anchors, and reachability passed.`);
