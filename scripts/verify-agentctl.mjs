import { spawnSync } from 'node:child_process';
import { statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const candidates = [
  process.env.AGENTCTL_REPO,
  path.resolve(siteRoot, '../agentctl'),
  path.resolve(siteRoot, '../../agentctl'),
].filter(Boolean);

const agentctlRoot = candidates.find((candidate) => {
  try {
    return statSync(path.join(candidate, 'Cargo.toml')).isFile();
  } catch {
    return false;
  }
});

if (!agentctlRoot) {
  throw new Error(`Unable to locate agentctl. Set AGENTCTL_REPO. Checked: ${candidates.join(', ')}`);
}

function run(command, args, cwd, env = process.env) {
  const result = spawnSync(command, args, { cwd, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('cargo', ['xtask', 'docs-verify'], agentctlRoot);
run(
  process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
  ['verify'],
  siteRoot,
  { ...process.env, AGENTCTL_REPO: agentctlRoot },
);
