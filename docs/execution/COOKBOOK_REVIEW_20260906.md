# Cookbook and onboarding review, 6 September 2026

## Scope and starting point

Continue documentation PR #6 from `d4b79f833d0a9d9983a44782d86453cc2e41061e` and framework PR #7 from `bb633fdec35a73f986d7d5d5d74e4f6c72ef6923`. Preserve existing public routes and earlier evidence. No publication or deployment is authorized.

The review findings were reproduced in source: only the suite overview was imported; relative asset links fell back to `blob/main`; Start here foregrounded product/completeness records; a header v1 badge could imply stable product maturity; first-use documentation required repository files; installation advertised an unverified published package as a path to candidate features.

## Implemented editorial and import changes

- Six navigation groups follow user tasks: Start, Author, Cookbook, Operate and recover, Reference, Contribute and architecture. Historical evidence retains its URLs under the collapsed contributor group.
- Twenty hand-maintained tutorials are imported under stable `examples/devops/<directory>/` routes, grouped for CI developers, platform engineers, SREs, and release/security practitioners.
- Source/edit/asset links use the imported source commit. The importer renders exact candidate installation commands and generates complete deterministic ZIPs using the framework's supported package command.
- ZIP hashes, source identity, tutorial routes, and byte counts are recorded in public metadata. Artifact verification inspects complete archive contents and per-file digests; it does not infer completeness merely from download success.
- First deterministic and bounded-agent guides include complete executable YAML and fixture content. Workflow API v1 is explicitly distinguished from the pre-1.0 CLI and crates.
- Tutorials lead with package preparation, direct CLI commands, editable inputs, workflow boundaries, evidence limits and recovery. Acceptance details remain in contributor material. Doctor documentation distinguishes static checks from unverified transitive dependencies and runtime success.

## Draft checks completed

- JavaScript syntax checks for Astro configuration and importer passed.
- Writing and hand-authored Markdown lint checks passed.
- Both inline onboarding workflows passed check, plan, run, inspect and keyless replay in fresh local directories using the existing compiled binary. `work/onboarding-results.json` retains commands, output, binary SHA and the explicit draft/local-binary qualification. This is not final pinned-install evidence.

## Remaining validation

1. Integrate final workflow and helper contracts; reconcile tutorial file layouts and direct commands with complete packages.
2. Synchronize against the exact framework code commit and update the paired workflow pin.
3. Run generated freshness, spelling, Astro checks/build, artifact and archive checks, links, anchors, Mermaid and responsive Playwright/axe/search/copy checks. All twenty tutorial routes must pass.
4. Execute the published direct paths and first-run/recovery walkthroughs with the matching installed binary. Record framework and docs source SHAs separately from later evidence-only commits.
5. Update the same draft PR. Public deployment remains a separate action and must not run.

## First integrated site checkpoint

Draft source `e76f194ae172763b1ecb8428c07b0f25f063e1e8` with working-tree changes:

- Synchronization produced 84 imported pages and twenty complete ZIPs.
- Astro check: zero errors, warnings or hints. Build: 91 pages; assembled artifact: 93 HTML files. Source, archive, internal link, anchor and reachability checks passed.
- Spelling: 95 files, zero issues after adding eight genuine technical dictionary terms. No prose-check exclusions were introduced.
- Responsive browser matrix: 121 passed in 1.9 minutes; two duplicate mobile search matrices were initially skipped. The new cookbook search skip was then removed and its full twenty-query mobile test passed separately in 18.9 seconds. Current tests therefore exercise cookbook search on all three viewport projects; only the earlier generic query matrix's mobile duplicate remains skipped.
- All twenty tutorials passed direct route/title, readable workflow, direct command, archive download, viewport-width and axe checks on desktop, tablet and mobile. Both desktop and tablet queried every tutorial's exact search entry. The standalone quickstart copy control returned complete YAML on all three projects.
- Captured desktop/mobile cookbook and recovery screenshots were visually inspected. Navigation, download links, maturity labeling and prose fit their viewports. Screenshots and logs remain in ignored `work/`.

The first browser launch was blocked by sandbox loopback `listen` EPERM. Authorized automatic approval review allowed the loopback-only test server and Chromium; tests then executed. A dependency symlink initially directed Vite cache writes outside this checkout and failed; it was replaced only in this isolated checkout with an APFS copy of the existing dependencies. No existing checkout, permission setting or security default was changed.

These checks establish the draft presentation, not final package semantics or a clean paired-source verdict. Tutorial and helper integration continues; rerun relevant content/build/browser gates after the exact final source pin.

## Direct command and container checkpoint

The documentation now includes actual selected report fields from eight passed analysis baselines and five passed format baselines in the framework's source-labeled direct-run reports. Earlier setup, gate and helper failures remain in those reports; selected successful baseline excerpts do not change their overall status.

Example 04's published optional image commands were executed with Podman consistently substituted for Docker. A complete new package and its own Python virtual environment installed all pinned requirements; setup, check, plan, run, inspect and keyless replay passed. The image used base `docker.io/library/python@sha256:3949e4271b0a3ff82afac7306764c313dcc8edeeb89c0376a3c2ac6007c66b1d`, built as `6309a5d7f776e26e81a18cb3a0ac11faf0e170941f107c08ff68e22bd89d63fd`, ran as `65534:65534` with a read-only root and no network, and returned `{"service":"fixture","healthy":true}`. Only the newly created example image was removed; the cached base remained.

Evidence: `work/docker04-direct/evidence/result.json`, complete command stdout/stderr and installed-dependency log. Run: `run-01a0758f-a8aa-7e83-9fa0-256b9d7b3e31`. Package metadata records source `e76f194ae172763b1ecb8428c07b0f25f063e1e8` with local changes and file hashes. This was an actual local image test, not production deployment or a performance benchmark. No provider request was made.

The existing Podman engine was available. Its local socket required authorized sandbox escalation; no VM, organization, TLS or production setting was changed.

## Independent operational walkthroughs

Complete packages with their own newly installed virtual environments were used for the following direct CLI paths; the acceptance runner was never invoked. Evidence records exact command arguments, expected/actual exit codes, stdout/stderr hashes, prepared-file hashes, source identity including dirty state, binary digest, run IDs and resulting artifacts.

- 14: reviewed durable approvals; exact prior bytes remained before deployment approval; the actual loopback HTTP response matched the healthy desired state afterward.
- 15: ordinary provider-free deployment and a separate authored 30-second fake-delay interruption. Read-only SQLite access discovered the active run ID; CLI inspection confirmed successful deployment and a started fake effect before killing only the owned process. Resume refused uncertainty at exit 3. Reconciliation applied only to the verified in-process fake delay; continuation succeeded with the mutation counter still one.
- 16: initial dependency-check failure exited 4. Restoring the explicit fixture enabled terminal retry; selective repair also succeeded. Both reused the compatible confirmed build, validated actual configuration bytes and kept its mutation count at one.
- 17: a custom prior version `7.8.9` with extra nested fields was captured byte-for-byte. The intentionally unhealthy rollout failed at exit 4; previewed compensation restored all prior bytes. A separately checked and executed reconciliation workflow verified the exact prior state through the actual loopback HTTP service.
- 18: the baseline four checks passed. Editing the authored service axis and adding real cache fixtures yielded six ordered checks. Lowering the timeout threshold failed at exit 4 and did not overwrite the earlier successful aggregate report.

The original report `work/direct-operations/results.json` preserves two unsuccessful attempts: an incorrect service-major ordering assumption in the independent test and an insufficient fault-fixture recovery budget. The engine retained the interrupted request reservation and correctly rejected the second request. The fixture now explicitly budgets for that reservation and one bounded continuation; engine enforcement was preserved. Only the affected cases were rerun in fresh packages. Both pass in `work/direct-operations-v2/results.json`.

The tutorials now document the actual axis order, deliberate interruption aid, compatible fault-workflow retry, separate reconciliation workflow and arbitrary prior-state setup. Selected actual report fields are shown for all twenty examples, including provider-free changed artifacts from the primary agent's `direct-changes-v2.json` for 19/20. These remain incremental dirty-source evidence until the final paired-source gates are complete.

## Final source pin and host launch blocker

The paired framework source is now `d388954c346865cb34c0f20a5f528e695ba39b8a`, clean and pushed. It includes the explicit example inventory, corrected recovery-fixture ceilings, complete standalone README link rendering, Python 3.11 minimum and pinned conditional dependencies, and the reviewed dependency lockfile correction. The site workflow pin, 84 imported pages and twenty package archives were regenerated together from that exact revision.

The first paired attempt against `23da795` passed all six framework documentation checks, freshness, writing, Mermaid source, workflow and Markdown checks, then failed spelling on two actual tool/API terms. Both were added narrowly to the dictionary. A subsequent attempt was deliberately interrupted before browser work when the framework inventory needed correction. These attempts are not final-source passing evidence.

The later `b930fa5` site attempt passed freshness, writing, Mermaid source, workflow, Markdown and spelling checks, but its Astro launcher stopped before entering application code. Sampling the owned `/bin/sh` process showed only `_dyld_start` at a 96 KB physical footprint for several minutes. The same host symptom was independently observed in framework build executables. The final paired command against `d388954` was retained as another blocked attempt. No safety setting, assertion, policy or required gate was disabled. The draft PR's hosted Linux validation is required to resolve this local evidence gap.

A new interaction test copies the complete YAML from every tutorial on all three viewport projects and compares the clipboard with every rendered source line. Its first focused run exposed a serious contrast failure in the temporary “Copied!” feedback (2.08:1). The site now supplies explicit dark-teal/white feedback colors through the supported code-frame configuration. Final browser validation must include that interaction; the failed trace remains in `work/cookbook-copy-check.log` and its test artifacts.

Package verification additionally checks that each remaining relative README link resolves inside the ZIP; informational links outside the package point at the exact framework source. Imported pages retain exact-source edit URLs. The invalid global fallback that pointed hand-authored site pages at the framework's main branch was removed.

Read-only inspection of all seven recorded operational replay children confirmed zero effects and zero provider requests/input/output tokens. `work/direct-operations-replay-audit.json` records that additional evidence without executing any replay again. Site-check and host-diagnostic logs remain in the ignored `work/` directory. Hosted and final direct-Node results must be recorded separately when available; the local combined gate is currently not a passing result.
