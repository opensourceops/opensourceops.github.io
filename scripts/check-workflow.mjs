import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflow = await readFile(path.join(root, '.github/workflows/pages.yml'), 'utf8');
const source = JSON.parse(await readFile(path.join(root, 'src/data/agentctl-source.json'), 'utf8'));
const errors = [];

const actions = [...workflow.matchAll(/^\s*uses:\s*([^@\s]+)@([^\s#]+)(?:\s+#\s+(.+))?$/gm)];
if (actions.length !== 7) errors.push(`expected 7 action references, found ${actions.length}`);
for (const [, action, revision, comment] of actions) {
  if (!/^[0-9a-f]{40}$/.test(revision)) errors.push(`${action} is not pinned to a full commit SHA`);
  if (!/^v\d/.test(comment || '')) errors.push(`${action} has no release comment`);
}

const pinnedCommit = workflow.match(/^\s*AGENTCTL_COMMIT:\s*"([0-9a-f]{40})"\s*$/m)?.[1];
if (!pinnedCommit) {
  errors.push('AGENTCTL_COMMIT must be pinned to a full commit SHA');
} else if (pinnedCommit !== source.commit) {
  errors.push(`AGENTCTL_COMMIT ${pinnedCommit} does not match synchronized source ${source.commit}`);
}
if (source.dirty !== false) {
  errors.push('final verification requires a clean framework checkout; commit source changes and synchronize again');
}
if (!workflow.includes('ref: ${{ github.event.pull_request.head.sha || github.sha }}')) {
  errors.push('Pages source checkout must select the exact pull-request head or event revision');
}
if ((workflow.match(/persist-credentials: false/g) || []).length !== 2) {
  errors.push('both repository checkouts must disable credential persistence');
}

for (const required of [
  'repository: opensourceops/agentctl',
  "if: github.event_name == 'pull_request'",
  "if: github.event_name != 'pull_request'",
  'name: agentctl-pages-validation',
  'if-no-files-found: error',
  'include-hidden-files: true',
  'pages: write',
  'id-token: write',
  'path: site/_site',
  'bash scripts/install-browser-deps.sh',
  'pnpm exec playwright install chromium',
  'run: pnpm verify:agentctl',
]) {
  if (!workflow.includes(required)) errors.push(`missing workflow contract: ${required}`);
}
if (workflow.includes('secrets.')) errors.push('Pages workflow must not read repository or provider secrets');

if (errors.length) throw new Error(errors.join('\n'));
console.log('Pages workflow action pins, permissions, artifact path, and credential-free contract passed.');
