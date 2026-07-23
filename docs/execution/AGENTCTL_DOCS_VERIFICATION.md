# agentctl documentation verification

## Evidence policy

Each result says whether it was executed locally, statically checked, configured only, or excluded. Normal verification neither reads nor requires a provider credential.

## Canonical evidence

Executed locally on 2026-07-23:

- `cargo xtask docs-verify`: generated schema and CLI freshness, v1 examples, documentation examples, source inclusion, writing rules, and Markdown links passed.
- `cargo xtask verify`: formatting, clippy, workspace build and tests, docs, examples, dependency policy, secret and action-pin scans, source installation, and production boundary passed. Existing duplicate-dependency warnings remain non-failing policy output.
- `cargo xtask acceptance-container`: success, artifacts, inspect, network-disabled replay, missing-secret and invalid-input failures, SIGTERM, non-root execution, read-only root, state, and artifact mounts passed.
- Clean-directory deterministic tutorial produced `hello, world`.
- Clean-directory fake-provider tutorial produced `AGENTCTL_MOCK_FIXTURE_VERIFIED` and the declared artifact.

No live OpenAI, Azure OpenAI, Anthropic, or Gemini request was made.

## Site evidence

The canonical cross-repository command imported 56 pages from clean agentctl commit `0ae1e381b87ea815f0d4ca66689db10bb1129e4a`, built 63 searchable pages, and assembled 65 HTML files across the root and project site.

| Check | Command or method | Evidence | Result |
| --- | --- | --- | --- |
| Generated freshness | sync followed by tracked diff | locally executed | pass |
| Writing and em dash | custom public-source scan | locally executed | pass |
| Mermaid syntax | Mermaid parser over 15 source blocks | locally executed | pass |
| Workflow safety | immutable pin, permission, artifact, and secret scan | locally executed | pass |
| Markdown | markdownlint | locally executed | pass |
| Spelling | cspell with a narrow technical dictionary | locally executed | pass |
| Astro types | `astro check` | locally executed | pass |
| Artifact build | Astro, Pagefind, and deterministic assembly | locally executed | pass |
| Links and discovery | internal paths, anchors, orphan graph, 11 external targets | locally executed | pass |
| Search | replay, OPENAI_API_KEY, approval, container, exit code, database locked, MCP, Gemini | Chromium desktop and tablet | pass |
| Browser routes | homepage plus seven major guides, nested refresh, base path, copy, nav, CTA, GitHub, 404 | Chromium at three viewports | pass |
| Mermaid rendering | 14 architecture SVGs, no client error, accessible titles and descriptions | Chromium at three viewports and manual inspection | pass |
| Accessibility | axe WCAG 2.2-oriented tags on four representative pages | Chromium at three viewports | no serious or critical findings |

Playwright reports 44 passing cases and one intentional skip: the full search query matrix runs on desktop and tablet, not a third time on mobile.

## Manual visual review

The final artifact was inspected at 1440 x 1000, 1024 x 768, and 390 x 844. Homepage hierarchy, calls to action, trust strip, guide header, mobile menu, table of contents, code overflow, diagrams, and page width were checked. Two class and flex-shrink collisions found during this pass were fixed before the final automated run.

This is a practical WCAG 2.2 AA review, not certification. Keyboard, contrast, reduced motion, labels, semantic structure, mobile zoom, and code scrolling have both implementation and automated evidence.

## Performance inspection

The assembled agentctl artifact is 8.7 MB uncompressed. The homepage HTML is about 28 KB, the architecture diagram HTML is about 68 KB, the Pagefind directory is 1.0 MB, and the social card is 699 KB. The largest generated JavaScript chunk is about 663 KB and belongs to Mermaid's conditional client bundle; the integration imports Mermaid only when a page contains `pre.mermaid`. The homepage uses system fonts and contains no Mermaid diagram. The build retains the chunk-size warning so future work can evaluate build-time SVG rendering or a narrower Mermaid runtime with measured evidence.

## Hosted evidence still required after merge

- Set Pages source to GitHub Actions as documented in `docs/DEPLOYMENT.md`.
- Run the pinned workflow on the merged commit and confirm its Pages environment URL.
- Verify the deployed organization root and `/agentctl/` deep links.
- Treat GitHub Actions, GitLab CI, Jenkins, Harness CI, Kubernetes, and live providers as syntax, mock, or configured evidence until those exact environments execute them.
