# agentctl launch-readiness documentation ledger

Updated: 2026-09-06, Asia/Kolkata. This ledger covers the current continuation; older execution ledgers describe historical evidence only.

## Scope and starting state

- Site: `codex/agentctl-launch-docs-20260906`, starting commit `b1484ef7cc073e6cc756a5eca37a7ff3f6144cee`.
- Framework checkout: sibling `../agentctl`, starting commit `ec7e220820ed169c005aff5344d81fe4d292cdb6`; current source pin `0eef26ae1d8034c8c8f49d5de4bdaa359a4ec494`.
- No repository or ancestor `AGENTS.md` was found in the inspected checkout.
- Authorized scope: importer, internal provenance, documentation onboarding, exact-checkout synchronization, build, and browser validation. No deployment, release, or organization settings changes.
- Runtime: Node 26.0.0; repository pnpm 11.9.0 invoked with `npx --yes pnpm@11.9.0` because Corepack is unavailable. Frozen-lockfile installation and Playwright Chromium installation passed without changing the dependency lockfile.

## Baseline

- `pnpm verify` failed at generated freshness: checked-in source metadata referenced `2aeaa88fba71162206b5f08f5bda4f0150247e4f`, while the actual sibling checkout was `ec7e220820ed169c005aff5344d81fe4d292cdb6` with local changes. This is a pre-existing source mismatch, not passing current evidence.
- Baseline `astro check` passed with zero errors, warnings, or hints. Baseline build passed; all 44 existing Playwright cases passed with the one documented duplicate mobile-search skip.
- The baseline manifest imported 61 pages. All received a visible source footer from `scripts/sync-agentctl.mjs`; editing generated pages alone would not repair it.

## Changes and compatibility

- Remove the source footer in the importer while preserving source edit links and content ownership.
- Preserve exact source provenance in synchronized JSON, expanded with a manifest of source paths, public routes, and SHA-256 digests of generated Markdown including expanded examples and rewritten assets/links.
- Extend the artifact gate to verify complete metadata coverage, content digests, generated routes, metadata copy equality, and absence of the removed phrase in all built HTML.
- Document reviewed generated-file staging and paired framework/workflow pins so intentional updates can pass the existing strict freshness gate.
- Require clean framework metadata in the workflow gate: a matching commit ID alone cannot establish final source provenance when local changes were imported. Preview builds remain available for dirty checkouts.
- Retain historical execution documents with their original dates; point repository onboarding to this continuation ledger.
- Add discoverable variable/instruction, twenty-example DevOps suite, and current limitation-review guides to the import manifest and navigation. Keep historical live evidence clearly labeled.

## Incremental verification

Against the working framework checkout at `ec7e220820ed169c005aff5344d81fe4d292cdb6`, before final integration:

- Writing, 22 Mermaid source blocks, Markdown, and spelling passed.
- Astro build produced 68 project pages; assembly produced 70 HTML files. Existing Mermaid chunk-size and duplicate 404-route build warnings remain visible.
- Artifact metadata coverage and digests for all 61 imports, routes, internal links, anchors, and reachability passed. All built HTML lacks the removed source phrase.
- Two negative artifact injections failed as expected: a reintroduced rendered footer and a modified provenance digest. Both files were restored, and the valid artifact passed again.
- External link checking passed for 14 unique remote targets without inconclusive warnings; local GitHub source/commit links were validated against the actual framework checkout.
- Pagefind index presence passed. Search behavior was executed in the baseline and remains required after final integration.
- Getting-started screenshots were captured at 1440 x 1000, 1024 x 768, and 390 x 844. Desktop and mobile images were visually inspected; no page-width overflow or visible source paragraph remained. Code blocks retain their horizontal scrolling behavior.

A later preview added the variable and DevOps guides: writing, Markdown,
spelling, build, artifact checks for 63 imports and 72 HTML files, and 15
external targets passed. The variable guide's credential-free CLI example was
also executed against the integrated development binary: check, explain,
doctor, default run, invocation override run, source deletion, replay, and
inspection verified the stated values and zero provider usage. Adding the current limitation-review guide brought preview coverage to 64
imports and 73 HTML files, with artifact links/anchors passing. Expanded
browser coverage initially failed the mobile variables page's keyboard access
check for a horizontally scrolling table. A build-time Markdown transform now
adds keyboard focus to tables while preserving their native table semantics
and the existing visible focus outline. The transform uses Astro 7's existing native Markdown processor; its already-resolved package is now an explicit exact dependency, avoiding a deprecated processor switch. The regression checks exercise actual
arrow-key scrolling and retain the full axe assertion. All six affected desktop/tablet/mobile
route and accessibility checks then passed. New desktop and mobile variables
and DevOps screenshots were captured, with mobile variables and desktop DevOps
visually inspected.

These are incremental local results, not final-commit or hosted evidence. Provider credentials are neither read nor used by these site gates.

## Required final gates

The canonical command is `AGENTCTL_REPO=/absolute/path/to/agentctl pnpm verify:agentctl`. It runs framework `cargo xtask docs-verify` followed by generated freshness, writing, Mermaid source checks, workflow pins and permissions, Markdown, spelling, Astro types, build, artifact paths/links/anchors/reachability, external links, Pagefind, and Playwright.

Playwright covers direct routes/reload, navigation, workflow copy, provenance footer on the homepage, absence of the removed article footer, keyboard table scrolling, architecture Mermaid rendering, 404 recovery, axe accessibility, and ten search terms, including `varsFiles` and DevOps. It runs desktop (1440 x 1000), tablet, and mobile profiles; the existing mobile duplicate search matrix is intentionally skipped. Any warning from inconclusive external HTTP checks must remain visible in evidence.

## Verified source checkpoint: 266eb443

- Framework source: `266eb44360886aa3019e5d42eb9cd28d26f97246`, clean, paired with [framework draft PR 7](https://github.com/opensourceops/agentctl/pull/7).
- Site code tree: `c76b49402cf2df28c771a45e3a28306bd2d5163a`. This ledger update is evidence-only; it changes no rendered source or executable code.
- `AGENTCTL_REPO=/absolute/path/to/agentctl npx --yes pnpm@11.9.0 verify:agentctl` passed. The command initially waited during a local macOS executable-startup stall, then completed without skipping a gate.
- Framework documentation verification passed all six stages: binary build, CLI/schema freshness, current examples, documentation journeys, public writing/inclusions, and local Markdown links.
- Site freshness, writing, 22 Mermaid source blocks, workflow pins/permissions, Markdown, spelling, and Astro diagnostics passed. Frozen-lockfile installation passed after making the already-resolved native Markdown processor an explicit exact dependency.
- Final artifact verification passed for 64 imported guides and 73 HTML files, including content digests, routes, links, anchors, reachability, and absence of the removed article footer. All 15 external targets passed without inconclusive warnings; Pagefind exists and search exercised ten terms.
- Full Playwright suite: 53 passed in 43.5 seconds; the sole skip is the existing duplicate mobile search matrix. All three device profiles passed direct navigation/reload, page-width checks, sidebar access, workflow copy, 15 rendered architecture diagrams, 404 recovery, and serious/critical axe checks. The variables table also passed actual keyboard scrolling.
- Final screenshots were captured for getting started, variables, and DevOps at desktop, tablet, and mobile sizes. Mobile variables, desktop DevOps, and tablet getting started were visually inspected.
- Local assembled artifact: 280 files. SHA-256 of its sorted content-hash manifest: `e96480446b219dffe328fb20d6bbe966a8fc089c623059f96264851b77e93971`. The manifest uses one `SHA256(file bytes)`, two spaces, POSIX relative path, and LF per file, sorted by relative path. This identifies the local artifact, not an unobserved hosted artifact.
- Existing build warnings for the Mermaid chunk size and duplicate 404 route remain visible; they did not fail the repository's gates.

## Review and remaining evidence

The local documentation gate passes for the paired source. [Documentation draft PR 6](https://github.com/opensourceops/opensourceops.github.io/pull/6) is open and linked to framework PR 7; inspect the latest exact-source
credential-free hosted validation and artifact before review. Do not dispatch
Pages manually, merge, or deploy. Hosted results are recorded on the draft PR
and in the primary framework execution ledger. Framework release readiness
still requires its own final-source live, platform, image, package, security,
and SBOM gates; this documentation result does not certify them.

## Hosted checkpoint and artifact correction

Hosted [run 33995001549](https://github.com/opensourceops/opensourceops.github.io/actions/runs/33995001549)
passed at site head `c6debc15ca45e4ee839b5dca2fdcfabfff7d0b01`, paired with
framework `266eb44360886aa3019e5d42eb9cd28d26f97246`. It repeated the full
cross-repository gate, with 53 browser passes and the existing duplicate
mobile-search skip. Deployment was skipped.

The uploaded validation ZIP, artifact `9977833070`, matched its advertised
SHA-256 `5388259b5227f22710d7f60e5d8b31e5c7f0a21b2a5bcb608db8bfe077db335b`.
Downloading it exposed a packaging gap: the uploader's default hidden-file
exclusion omitted the required `.nojekyll` file, although the pre-upload
artifact check had passed. The validation upload now explicitly includes
hidden files within the generated `_site` directory; the workflow gate checks
that setting. This changes no deployment trigger or permission. Other observed
local/hosted byte differences were limited to platform-generated Pagefind
outputs; HTML, source metadata, and other public assets matched.

The framework fixture portability fix is now pinned as clean source
`29429de051cbc9ad0e47fff8a35f260d07daccdf`. The paired gate and downloaded ZIP
verification must pass again for this source and the corrected upload before
claiming the final documentation artifact is complete.

## Final local verification: 29429de

- Framework: `29429de051cbc9ad0e47fff8a35f260d07daccdf`, clean.
- Site code under test: `c4ac6c795b6752e5cf6210e48afc54bc3d76886a`, committed before the paired gate.
- Full `AGENTCTL_REPO=/absolute/path/to/agentctl npx --yes pnpm@11.9.0 verify:agentctl` passed again, including all framework documentation stages and site checks. Generated freshness, 64 imports, 73 HTML pages, 15 external targets, and source metadata are tied to this exact framework commit.
- Browser results: 53 passed in 43.6 seconds, with the same one existing duplicate mobile search skip. No assertions or required gates were removed.
- Local artifact: 280 files; sorted content-manifest SHA-256 `068c41ff0e7d0c3f9643f704f83eaca0d7d182066e72ddb639093243c9e4d831`. The earlier source's manifest and results remain retained separately.
- The following commit only records this evidence. Hosted validation and downloaded ZIP completeness must be observed at the corrected source before concluding the documentation artifact gate.

## Verified hosted artifact: 29429de

Hosted [run 33995829784](https://github.com/opensourceops/opensourceops.github.io/actions/runs/33995829784)
passed at site head `afa5f5315a3200dd2310db52a995dbfd36a719d7` with deployment
skipped. Downloaded artifact `9978067719` matched ZIP SHA-256
`c9be9336cf62aa3b6155d409bb9f8f2ec5de9dfb58db6b36279174a137e1a2fc`.
The corrected ZIP contains all 280 files, including `.nojekyll`. The actual
artifact checker passed against its extracted contents: 73 HTML pages,
links, anchors, reachability, source metadata, and all 64 imported digests.
Its content-manifest SHA-256 is
`f339efafe197de8cefed8e2dcadf8b3059d9e20406bcfc87b36ffab239283037`.

## Current integration: 0eef26a

The new clean framework source is
`0eef26ae1d8034c8c8f49d5de4bdaa359a4ec494`. Import the revised testing guide
with its explicitly labeled composite live continuation and preserve the
distinction between that subset and a complete legacy live inventory. Prior
Astra and independent Sol evidence remains identified by the framework ledger;
site validation makes no paid provider requests. Commit this source pin before
running the full paired gate, then verify the uploaded artifact again.

## Final local verification: 0eef26a

- Framework source: `0eef26ae1d8034c8c8f49d5de4bdaa359a4ec494`, clean.
- Site code under test: `e813d1650731a89bfb7cc83eca7762491dad7a5f`, committed before validation.
- Full `AGENTCTL_REPO=/absolute/path/to/agentctl npx --yes pnpm@11.9.0 verify:agentctl` passed. Framework documentation stages, imported freshness, all 64 source digests, 73 HTML pages, 15 external targets, workflow upload settings, writing, Mermaid, search, and Astro checks passed.
- All 53 required browser cases passed in 42.8 seconds; the existing duplicate mobile-search case remains the only skip. This includes accessibility and actual keyboard table scrolling.
- Local artifact: 280 files; sorted content-manifest SHA-256 `a2528a07205900e498fb2304143b150d814d19bb4289d8defc3174d52b7c9392`.
- This following ledger update is evidence-only. Hosted validation and downloaded ZIP verification remain required for this latest pin; previous complete checkpoints are recorded above.
