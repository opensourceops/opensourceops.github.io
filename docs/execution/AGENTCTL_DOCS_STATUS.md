# agentctl documentation status

Updated: 2026-07-23, Asia/Kolkata

## Current phase

Implementation and local verification are complete. Deployment, push, Pages enablement, repository settings, and live-provider calls were intentionally not performed.

## Repository state

| Repository | Branch | Starting commit | Current content commit |
| --- | --- | --- | --- |
| `agentctl` | `codex/agentctl-documentation-source` | `29452db` | `0ae1e381b87ea815f0d4ca66689db10bb1129e4a` |
| `opensourceops.github.io` | `codex/agentctl-site` | `d71dc4d` | `HEAD` containing this ledger |

Both repositories started clean. The canonical repository is clean after its documentation commit. The Pages commit is the commit containing this ledger; resolve its immutable ID with `git rev-parse HEAD` after checkout.

## Completed scope

- Canonical tutorials, concepts, operations, security, troubleshooting, reference, architecture, use cases, developer guides, contributing, and terminology
- Five credential-free documentation workflows plus provider-portability variants
- `cargo xtask docs-verify` and its hosted CI step
- Deterministic import of 56 canonical pages with source commit metadata and stale-content checking
- Astro and Starlight site, root organization page, Pagefind search, SEO, favicon, social card, 404, feedback links, and responsive design
- Fourteen architecture diagrams with accessible titles and descriptions
- Deterministic `_site` assembly with physical `agentctl/index.html`
- Least-privilege GitHub Pages validation and deployment workflow with immutable action pins
- Internal links, anchors, orphans, external links, writing, spelling, Markdown, workflow, browser, search, accessibility, and responsive checks
- Product, documentation, and UX review passes with findings fixed

## Verification status

| Gate | Status | Evidence |
| --- | --- | --- |
| Canonical docs and examples | pass | `cargo xtask docs-verify` |
| Full Rust repository gate | pass | `cargo xtask verify` |
| Container contract | pass | locally executed `cargo xtask acceptance-container` |
| Site build and generated freshness | pass | clean source commit `0ae1e38`, 63 indexed pages |
| Internal links, anchors, and orphans | pass | 65 final HTML files |
| External links | pass | 11 unique public targets, with unpushed canonical files and commit checked locally |
| Writing, spelling, and Markdown | pass | no public em dash; cspell and markdownlint pass |
| Mermaid | pass | 15 source blocks; 14 architecture SVGs render and are labelled |
| Search | pass | eight required queries on desktop and tablet |
| Browser and deep links | pass | 44 Playwright cases pass; mobile-only duplicate search case is intentionally skipped |
| Accessibility automation | pass | no serious or critical axe finding on representative pages at three viewports |
| Responsive manual review | pass | 1440 x 1000, 1024 x 768, and 390 x 844 inspected |
| Final Pages artifact | pass | root site, `.nojekyll`, and `agentctl/index.html` present |
| Hosted Pages deployment | configured only | requires merge and manual repository setting |

Automated accessibility and local browser checks are evidence, not an accessibility certification. Live provider calls remain opt-in and outside normal documentation verification.

## Review outcomes

- Product review confirmed that the homepage states the control-layer boundary, primary audience, concrete use cases, durable-state behavior, maturity, and limitations without a production-readiness claim.
- Documentation review confirmed the deterministic and fake-provider tutorials from clean directories, recovery semantics, complete field and CLI reference, container operations, and contributor architecture.
- UX review fixed a stretched maturity badge, a clipped mobile project title, muted-text contrast, and keyboard access to horizontally scrollable code. It also confirmed both Getting started calls to action, 404 recovery, search, copy, sidebar, and deep-link refresh behavior.

## Exact verification commands

From the canonical repository:

```text
cargo xtask docs-verify
cargo xtask verify
cargo xtask acceptance-container
git diff --check
```

From the Pages repository:

```text
AGENTCTL_REPO=/path/to/agentctl pnpm verify:agentctl
git diff --check
```
