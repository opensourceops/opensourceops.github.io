import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'dist-agentctl');
const rootSite = path.join(root, 'root-site');
const artifact = path.join(root, '_site');
const agentctlTarget = path.join(artifact, 'agentctl');

for (const expected of [path.join(source, 'index.html'), path.join(rootSite, 'index.html')]) {
  try {
    if (!(await stat(expected)).isFile()) throw new Error(`${expected} is not a file`);
  } catch (error) {
    throw new Error(`Cannot assemble Pages artifact: ${error.message}`);
  }
}

await rm(artifact, { recursive: true, force: true });
await mkdir(artifact, { recursive: true });
await cp(rootSite, artifact, { recursive: true, errorOnExist: true });
await mkdir(agentctlTarget, { recursive: false });
await cp(source, agentctlTarget, { recursive: true, errorOnExist: true });
await cp(path.join(source, '404.html'), path.join(agentctlTarget, '404.html'), { force: true });

const noJekyll = path.join(artifact, '.nojekyll');
await writeFile(noJekyll, '');

const rootEntries = await readdir(artifact);
if (!rootEntries.includes('index.html') || !rootEntries.includes('agentctl')) {
  throw new Error('Artifact assembly lost the root site or agentctl subpath');
}

console.log(`Assembled ${artifact} with agentctl/index.html.`);
