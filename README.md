# OpenSourceOps GitHub Pages

This repository builds the organization root site and the public `agentctl` documentation at `/agentctl/`. Technical content is canonical in `opensourceops/agentctl`; a deterministic manifest imports it into an Astro and Starlight presentation layer.

## Prerequisites

- Node.js 22 or newer
- pnpm 11.9.0 through Corepack
- Rust 1.88.0 and Cargo
- Playwright Chromium for the full browser gate
- local checkouts of this repository and `agentctl`

Set `AGENTCTL_REPO` when the agentctl checkout is not in a documented sibling location.

## Local development

```text
corepack enable
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
AGENTCTL_REPO=/path/to/agentctl pnpm docs:sync
pnpm dev:agentctl
```

The development URL is `http://localhost:4321/agentctl/`. The development server makes no provider request, but dependency installation can use the package registry.

## Build and verify

```text
AGENTCTL_REPO=/path/to/agentctl pnpm build
AGENTCTL_REPO=/path/to/agentctl pnpm verify:agentctl
```

`pnpm build` writes the complete Pages artifact to `_site`; serve that directory at its root and open `/agentctl/`. `pnpm verify:agentctl` is the canonical cross-repository gate. It runs `cargo xtask docs-verify`, synchronizes canonical content, checks writing, spelling, links, anchors, Mermaid, search, and generated freshness, builds the final artifact, then runs responsive Playwright and axe checks.

Common failures are a missing `AGENTCTL_REPO`, stale generated source or CLI references, a missing Playwright browser, or another process using port 4173. No verification command needs a provider API key.

Source ownership, routes, content digests, and the exact framework commit remain in `public/meta/agentctl-source.json`; imported pages keep their source edit links. The importer does not append provenance boilerplate to the page body. When updating framework content, follow the [paired source update](docs/DEPLOYMENT.md#paired-source-updates) before running the freshness gate.

See [deployment settings](docs/DEPLOYMENT.md) and the [current documentation execution ledger](docs/execution/AGENTCTL_LAUNCH_READINESS_20260906.md). The older execution documents retain evidence from their stated dates.
