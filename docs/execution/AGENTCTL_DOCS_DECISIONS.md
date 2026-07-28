# agentctl documentation decisions

## D001: Astro with Starlight

Status: accepted, 2026-07-23.

The Pages repository had no website framework or public files beyond a one-line README. The agentctl site uses Astro with Starlight because the task calls for documentation navigation, static search, accessible defaults, Markdown and MDX, code-copy controls, and a static subpath build. Astro is configured with `site: https://opensourceops.github.io` and `base: /agentctl/`.

## D002: Physical artifact composition

Status: accepted, 2026-07-23.

Astro's base option fixes URLs but does not by itself place its entry page in `agentctl/index.html`. A deterministic assembly step copies the agentctl build into `_site/agentctl/` and composes the root OpenSourceOps page separately. It fails on path conflicts and verifies the required physical layout.

## D003: Canonical content ownership

Status: accepted, 2026-07-23.

The `agentctl` repository owns commands, schema, examples, provider and protocol maturity, runtime semantics, architecture, security, operations, limitations, and contributor contracts. The Pages repository owns the homepage, navigation, learning paths, search, site styling, SEO, testing, deployment, and generated presentation copies.

## D004: Deterministic import

Status: accepted, 2026-07-23.

A checked manifest maps canonical source files to public routes. The importer fails on missing sources, rewrites local Markdown and image links, preserves code fences, copies downloadable references, records the source Git commit, and replaces its generated directory atomically. Local resolution accepts `AGENTCTL_REPO` and documented sibling-checkout locations. Hosted CI checks out both repositories into one workspace.

## D005: Evidence language

Status: accepted, 2026-07-23.

Public pages distinguish deterministic tests, mock-protocol tests, retained
live OpenAI evidence, locally executed container evidence, hosted CI execution,
syntax validation, deferred work, and unsupported work. The site identifies
`agentctl.dev/v1` as the stable workflow document API while keeping the 0.3 CLI
and crates explicitly pre-1.0 and avoiding unsupported production or provider
claims.

## D006: Static and restrained design

Status: accepted, 2026-07-23.

The visual system uses high-contrast neutral surfaces, one teal accent, system fonts, compact cards, and restrained motion. It uses no generic AI imagery, animated background, or decorative diagram. Diagrams explain behavior and include surrounding text.

## D007: Credential-free Pages workflow

Status: accepted, 2026-07-23.

Pull requests run the complete build and verification gate with read-only repository permission. Only `main` pushes or manual dispatches reach the deployment job, which alone receives `pages: write` and `id-token: write`. GitHub-owned actions are pinned to full commit SHAs with release comments. The workflow checks out the canonical repository and requires no provider or repository secret.

## D008: Conditional Mermaid cost

Status: accepted, 2026-07-23.

Mermaid renders locally and is loaded only when a page contains a diagram. The generated Mermaid bundle includes diagram types the package supports and produces a 663 KB largest uncompressed chunk. The homepage does not contain a Mermaid block, uses system fonts, and remains a 28 KB HTML document. The specialized diagram page accepts the conditional client cost for accessible theme-aware diagrams; the build records the bundle warning instead of inventing a performance claim.
