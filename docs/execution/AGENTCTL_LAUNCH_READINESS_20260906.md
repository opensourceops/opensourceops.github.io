# agentctl launch-readiness documentation ledger

Updated: 2026-09-06, Asia/Kolkata. This ledger covers the current continuation; older execution ledgers describe historical evidence only.

## Scope and starting state

- Site: `codex/agentctl-launch-docs-20260906`, starting commit `b1484ef7cc073e6cc756a5eca37a7ff3f6144cee`.
- Framework checkout: sibling `../agentctl`, starting commit `ec7e220820ed169c005aff5344d81fe4d292cdb6`; final source pin pending framework integration.
- No repository or ancestor `AGENTS.md` was found in the inspected checkout.
- Authorized scope: importer, internal provenance, documentation onboarding, exact-checkout synchronization, build, and browser validation. No deployment, release, or organization settings changes.
- Runtime: Node 26.0.0; repository pnpm 11.9.0 invoked with `npx --yes pnpm@11.9.0` because Corepack is unavailable. Frozen-lockfile installation and Playwright Chromium installation passed without changing the dependency lockfile.

## Baseline

- `pnpm verify` failed at generated freshness: checked-in source metadata referenced `2aeaa88fba71162206b5f08f5bda4f0150247e4f`, while the actual sibling checkout was `ec7e220820ed169c005aff5344d81fe4d292cdb6` with local changes. This is a pre-existing source mismatch, not passing current evidence.
- Baseline `astro check` passed with zero errors, warnings, or hints. Baseline build passed; all 44 existing Playwright cases passed with the one documented duplicate mobile-search skip.
- The manifest imports 61 pages. All received a visible source footer from `scripts/sync-agentctl.mjs`; editing generated pages alone would not repair it.

## Changes and compatibility

- Remove the source footer in the importer while preserving source edit links and content ownership.
- Preserve exact source provenance in synchronized JSON, expanded with a manifest of source paths, public routes, and SHA-256 digests of generated Markdown including expanded examples and rewritten assets/links.
- Extend the artifact gate to verify complete metadata coverage, content digests, generated routes, metadata copy equality, and absence of the removed phrase in all built HTML.
- Document reviewed generated-file staging and paired framework/workflow pins so intentional updates can pass the existing strict freshness gate.
- Require clean framework metadata in the workflow gate: a matching commit ID alone cannot establish final source provenance when local changes were imported. Preview builds remain available for dirty checkouts.
- Retain historical execution documents with their original dates; point repository onboarding to this continuation ledger.

## Incremental verification

Against the working framework checkout at `ec7e220820ed169c005aff5344d81fe4d292cdb6`, before final integration:

- Writing, 22 Mermaid source blocks, Markdown, and spelling passed.
- Astro build produced 68 project pages; assembly produced 70 HTML files. Existing Mermaid chunk-size and duplicate 404-route build warnings remain visible.
- Artifact metadata coverage and digests for all 61 imports, routes, internal links, anchors, and reachability passed. All built HTML lacks the removed source phrase.
- Two negative artifact injections failed as expected: a reintroduced rendered footer and a modified provenance digest. Both files were restored, and the valid artifact passed again.
- External link checking passed for 14 unique remote targets without inconclusive warnings; local GitHub source/commit links were validated against the actual framework checkout.
- Pagefind index presence passed. Search behavior was executed in the baseline and remains required after final integration.
- Getting-started screenshots were captured at 1440 x 1000, 1024 x 768, and 390 x 844. Desktop and mobile images were visually inspected; no page-width overflow or visible source paragraph remained. Code blocks retain their horizontal scrolling behavior.

These are incremental local results, not final-commit or hosted evidence. Provider credentials are neither read nor used by these site gates.

## Required final gates

The canonical command is `AGENTCTL_REPO=/absolute/path/to/agentctl pnpm verify:agentctl`. It runs framework `cargo xtask docs-verify` followed by generated freshness, writing, Mermaid source checks, workflow pins and permissions, Markdown, spelling, Astro types, build, artifact paths/links/anchors/reachability, external links, Pagefind, and Playwright.

Playwright covers direct routes/reload, navigation, workflow copy, source footer on the homepage, architecture Mermaid rendering, 404 recovery, axe accessibility, and eight search terms. It runs desktop (1440 x 1000), tablet, and mobile profiles; the existing mobile duplicate search matrix is intentionally skipped. Any warning from inconclusive external HTTP checks must remain visible in evidence.

## Remaining work and next commands

1. Finish independent site baseline and verify importer changes against the integrated framework checkout.
2. Receive final framework code commit, update `AGENTCTL_COMMIT`, synchronize from the clean exact checkout, and stage reviewed generated files.
3. Run full cross-repository verification, inspect responsive screenshots, record artifact digest and exact source commit, and commit site changes.
4. Coordinate draft pull request creation and hosted validation with the primary agent. Do not dispatch the site workflow because manual dispatch also deploys.

Current verdict: documentation release evidence is incomplete until the final integrated source pin and all required gates pass.
