import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflow = await readFile(path.join(root, '.github/workflows/pages.yml'), 'utf8');
const source = JSON.parse(await readFile(path.join(root, 'src/data/agentctl-source.json'), 'utf8'));
const errors = [];

const actions = [...workflow.matchAll(/^\s*uses:\s*([^@\s]+)@([^\s#]+)(?:\s+#\s+(.+))?$/gm)];
if (actions.length !== 6) errors.push(`expected 6 action references, found ${actions.length}`);
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

for (const required of [
  'repository: opensourceops/agentctl',
  "if: github.event_name != 'pull_request'",
  'pages: write',
  'id-token: write',
  'path: site/_site',
]) {
  if (!workflow.includes(required)) errors.push(`missing workflow contract: ${required}`);
}
if (workflow.includes('secrets.')) errors.push('Pages workflow must not read repository or provider secrets');

if (errors.length) throw new Error(errors.join('\n'));
console.log('Pages workflow action pins, permissions, artifact path, and credential-free contract passed.');
