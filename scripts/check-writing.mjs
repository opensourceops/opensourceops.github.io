import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicBrandingIssues } from './public-branding.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const roots = ['src/content/docs', 'src/components', 'root-site', 'docs'].map((entry) => path.join(root, entry));
const extensions = new Set(['.md', '.mdx', '.astro', '.html']);
const discouraged = [
  'unlock', 'unleash', 'revolutionize', 'supercharge', 'seamlessly', 'effortlessly',
  'cutting-edge', 'game-changing', 'next-generation', 'robust and scalable',
  'powerful solution', "in today's fast-paced world",
];

async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await files(absolute)));
    else if (extensions.has(path.extname(entry.name))) result.push(absolute);
  }
  return result;
}

const errors = [];
for (const directory of roots) {
  for (const file of await files(directory)) {
    const source = await readFile(file, 'utf8');
    const relative = path.relative(root, file);
    if (source.includes('—')) errors.push(`${relative}: contains an em dash`);
    if (!relative.startsWith('docs/execution/') && source.includes('/Users/')) {
      errors.push(`${relative}: contains an absolute local path`);
    }
    if (!relative.startsWith('docs/execution/')) {
      for (const issue of publicBrandingIssues(source)) errors.push(`${relative}: ${issue}`);
    }
    const lower = source.toLowerCase();
    for (const phrase of discouraged) {
      if (lower.includes(phrase)) errors.push(`${relative}: contains discouraged phrase “${phrase}”`);
    }
  }
}

if (errors.length) throw new Error(errors.join('\n'));
console.log('Writing checks passed, including the em dash rule.');
