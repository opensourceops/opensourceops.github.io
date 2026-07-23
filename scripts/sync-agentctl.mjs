import { execFileSync } from 'node:child_process';
import {
  copyFile,
  mkdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentManifest } from './content-manifest.mjs';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const generatedRoot = path.join(siteRoot, 'src/content/docs/_generated');
const nextRoot = path.join(siteRoot, 'src/content/docs/_generated.next');
const backupRoot = path.join(siteRoot, 'src/content/docs/_generated.previous');
const basePath = '/agentctl/';

const candidates = [
  process.env.AGENTCTL_REPO,
  path.resolve(siteRoot, '../agentctl'),
  path.resolve(siteRoot, '../../agentctl'),
].filter(Boolean);

let agentctlRoot;
for (const candidate of candidates) {
  try {
    const cargo = await stat(path.join(candidate, 'Cargo.toml'));
    const readme = await stat(path.join(candidate, 'README.md'));
    if (cargo.isFile() && readme.isFile()) {
      agentctlRoot = path.resolve(candidate);
      break;
    }
  } catch {
    // Try the next documented checkout layout.
  }
}

if (!agentctlRoot) {
  throw new Error(
    `Unable to locate agentctl. Set AGENTCTL_REPO. Checked: ${candidates.join(', ')}`,
  );
}

const trackedPaths = new Set(
  execFileSync('git', ['ls-files'], {
    cwd: agentctlRoot,
    encoding: 'utf8',
  })
    .trim()
    .split('\n'),
);
for (const [source] of contentManifest) {
  if (!trackedPaths.has(source)) {
    throw new Error(`Canonical source path must exactly match Git: ${source}`);
  }
}

const sourceMap = new Map();
for (const [source, target] of contentManifest) {
  const slug = target
    .replace(/^_generated\//, '')
    .replace(/\.md$/, '')
    .replace(/\/index$/, '');
  sourceMap.set(source, `${basePath}${slug ? `${slug}/` : ''}`);
}

const specialRoutes = new Map([
  ['CODE_OF_CONDUCT.md', `${basePath}contributing/`],
  ['SECURITY.md', `${basePath}security/`],
  ['docs/adr', `${basePath}architecture/decisions/`],
  ['schemas/workflow.schema.json', `${basePath}downloads/workflow.schema.json`],
]);

function yamlQuote(value) {
  return JSON.stringify(value);
}

function sourceRoute(sourcePath, destination) {
  if (/^(?:https?:|mailto:|#|\/)/.test(destination)) return destination;
  const [rawPath, anchor = ''] = destination.split('#', 2);
  if (!rawPath) return destination;
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), rawPath));
  const route = sourceMap.get(resolved) || specialRoutes.get(resolved);
  if (route) return `${route}${anchor ? `#${anchor}` : ''}`;
  return `https://github.com/opensourceops/agentctl/blob/main/${resolved}${anchor ? `#${anchor}` : ''}`;
}

async function rewriteImages(sourcePath, markdown) {
  const imagePattern = /(!\[[^\]]*\])\(([^)]+)\)/g;
  const replacements = [];
  for (const match of markdown.matchAll(imagePattern)) {
    const destination = match[2];
    if (/^(?:https?:|data:|\/)/.test(destination)) continue;
    const clean = destination.split('#', 1)[0];
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), clean));
    const sourceFile = path.join(agentctlRoot, resolved);
    const targetRelative = path.posix.join('imported-assets', resolved);
    const targetFile = path.join(siteRoot, 'public', targetRelative);
    try {
      if (!(await stat(sourceFile)).isFile()) continue;
    } catch {
      throw new Error(`Missing image referenced by ${sourcePath}: ${destination}`);
    }
    await mkdir(path.dirname(targetFile), { recursive: true });
    await copyFile(sourceFile, targetFile);
    replacements.push([match[0], `${match[1]}(${basePath}${targetRelative})`]);
  }
  return replacements.reduce((value, [from, to]) => value.replace(from, to), markdown);
}

async function expandIncludes(sourcePath, markdown) {
  const pattern = /<!-- agentctl-include: ([^\s]+) language=([a-z0-9_-]+) -->/g;
  let result = '';
  let cursor = 0;
  for (const match of markdown.matchAll(pattern)) {
    const includePath = match[1];
    const language = match[2];
    const absolute = path.join(agentctlRoot, includePath);
    let included;
    try {
      included = await readFile(absolute, 'utf8');
    } catch (error) {
      throw new Error(`Missing include ${includePath} referenced by ${sourcePath}: ${error.message}`);
    }
    result += markdown.slice(cursor, match.index);
    result += `\n\`\`\`${language}\n${included.trimEnd()}\n\`\`\`\n`;
    cursor = match.index + match[0].length;
  }
  return result + markdown.slice(cursor);
}

async function transform(sourcePath, title, description, commit, dirty) {
  const absolute = path.join(agentctlRoot, sourcePath);
  let markdown;
  try {
    markdown = await readFile(absolute, 'utf8');
  } catch (error) {
    throw new Error(`Missing canonical source ${sourcePath}: ${error.message}`);
  }
  markdown = markdown.replace(/^#\s+[^\n]+\n+/, '');
  markdown = await expandIncludes(sourcePath, markdown);
  markdown = await rewriteImages(sourcePath, markdown);
  markdown = markdown.replace(/(?<!!)(\[[^\]]*\])\(([^)]+)\)/g, (_all, label, destination) => {
    return `${label}(${sourceRoute(sourcePath, destination)})`;
  });

  const verified = dirty ? `${commit} with local changes` : commit;
  const frontmatter = [
    '---',
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `editUrl: ${yamlQuote(`https://github.com/opensourceops/agentctl/edit/main/${sourcePath}`)}`,
    '---',
    '',
  ].join('\n');
  const provenance = [
    '',
    `> Canonical source: [\`${sourcePath}\`](https://github.com/opensourceops/agentctl/blob/main/${sourcePath}). Verified against agentctl commit \`${verified}\`.`,
    '',
  ].join('\n');
  return `${frontmatter}${markdown.trim()}${provenance}`;
}

const commit = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: agentctlRoot,
  encoding: 'utf8',
}).trim();
const dirty = Boolean(
  execFileSync('git', ['status', '--porcelain'], {
    cwd: agentctlRoot,
    encoding: 'utf8',
  }).trim(),
);
const cargo = await readFile(path.join(agentctlRoot, 'Cargo.toml'), 'utf8');
const version = cargo.match(/\[workspace\.package\][\s\S]*?\nversion\s*=\s*"([^"]+)"/)?.[1];
if (!version) throw new Error('Unable to read agentctl workspace version');

await rm(nextRoot, { recursive: true, force: true });
await rm(backupRoot, { recursive: true, force: true });
await mkdir(nextRoot, { recursive: true });

for (const [source, target, title, description] of contentManifest) {
  const output = path.join(nextRoot, target.replace(/^_generated\//, ''));
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, await transform(source, title, description, commit, dirty));
}

try {
  await rename(generatedRoot, backupRoot);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

try {
  await rename(nextRoot, generatedRoot);
  await rm(backupRoot, { recursive: true, force: true });
} catch (error) {
  try {
    await rename(backupRoot, generatedRoot);
  } catch {
    // Preserve the original error if rollback is not possible.
  }
  throw error;
}

await mkdir(path.join(siteRoot, 'src/data'), { recursive: true });
await mkdir(path.join(siteRoot, 'public/downloads'), { recursive: true });
await mkdir(path.join(siteRoot, 'public/meta'), { recursive: true });
await copyFile(
  path.join(agentctlRoot, 'schemas/workflow.schema.json'),
  path.join(siteRoot, 'public/downloads/workflow.schema.json'),
);
await copyFile(
  path.join(agentctlRoot, 'examples/acceptance/mock-tool/workflow.yaml'),
  path.join(siteRoot, 'src/data/home-workflow.yaml'),
);

const metadata = {
  product: 'agentctl',
  version,
  workflowApi: 'agentctl.dev/v1alpha1',
  commit,
  dirty,
  sourceRepository: 'https://github.com/opensourceops/agentctl',
  importedFiles: contentManifest.length,
};
await writeFile(
  path.join(siteRoot, 'src/data/agentctl-source.json'),
  `${JSON.stringify(metadata, null, 2)}\n`,
);
await writeFile(
  path.join(siteRoot, 'public/meta/agentctl-source.json'),
  `${JSON.stringify(metadata, null, 2)}\n`,
);

console.log(
  `Synchronized ${contentManifest.length} canonical pages from agentctl ${commit}${dirty ? ' (dirty)' : ''}.`,
);
