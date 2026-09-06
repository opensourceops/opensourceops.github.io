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

## Direct Node validation and copy-feedback correction

At docs source `18a004c5a48e52bd0669fe89bda4d87516d9735e` with framework `d388954`, invoking the same pinned Astro CLI through Node passed diagnostics with zero errors/warnings/hints and built 91 pages. Assembly and artifact checks passed for 93 HTML files, twenty complete packages, their relative README links, internal links, anchors and route reachability. Search-index validation passed. The external check verified 150 exact Git objects locally plus ten remaining URLs, with no warnings or definite failures.

The expanded browser run correctly rejected the copy feedback during its opacity transition: the foreground and background faded together, lowering contrast while visible. The remaining fix removes only opacity from that scoped transition; movement remains animated. The original color-contrast assertion was preserved. The focused cookbook test then passed on desktop, tablet and mobile (three tests, 6.6 seconds). The complete responsive matrix is still required for the final docs commit. Earlier failed browser attempts and the blocked combined command remain distinct from these successful component checks.

## Final keyboard-scroll correction and paired revision

The final framework revision is `45d0995345ba048d8a8368466f56c388cc8cb992`; all imported source links, workflow pins and complete archives now match it. The later change from `d388954` is a portability test correction and its evidence, not cookbook behavior.

The full browser run at `ef9b026` passed 121 tests, skipped the existing duplicate generic mobile search test, and failed one desktop matrix-page keyboard check. The code renderer manages focus for horizontal overflow; the site's 42rem height cap created vertical overflow that its observer did not recognize. A build-time focus attribute alone did not resolve that observer conflict, and that unsuccessful experiment was removed. The final change removes the documentation code-height cap and obsolete competing client script. Long code scrolls vertically with the page; the renderer continues managing wide lines, and the custom homepage block already has a static focus attribute.

The exact failing tutorial then passed on desktop, tablet and mobile (three tests, 6.4 seconds) with unchanged accessibility assertions. The final complete browser and hosted paired runs remain separate gates; their results will follow this code commit. No failure or interrupted attempt is counted as passing evidence.

## Complete site checks and final source reconciliation

All fourteen unchanged underlying site-gate commands passed at clean docs source `1fd5825540d7b9bcad183a3f4ff9af3477bf5cf9` with clean framework source `45d0995345ba048d8a8368466f56c388cc8cb992`. The installed, pinned package CLI entrypoints were invoked directly through Node to avoid the diagnosed host shell-launch failure. This preserves the original validation code and assertions; it does not claim the Rust prelude or combined `verify:agentctl` command passed locally. The structured report `work/final-site-1fd5825/result.json` records command arguments, timings and log hashes.

Freshness, writing, Mermaid, workflow, Markdown, spelling, Astro diagnostics/build, assembly, source/package/link/anchor checks, external links and search passed. The full responsive browser suite passed 122 tests in 2.5 minutes, with only the existing duplicate generic mobile search test skipped. Every cookbook tutorial's new mobile search, complete YAML copy, download and accessibility checks executed. The earlier failures remain separate evidence.

The final framework pin is now `30167c8330b1a3fb0bb89c2426d6310e1efd6aa4`. Its only changes after `45d0995` are a Windows test expected-path correction and execution evidence; cookbook helper, workflow and tutorial bytes are unchanged. Imported pages, exact-source links and complete archives were regenerated for this final identity. The documentation PR validation will run the combined gate on Linux at the exact paired commits. No deployment was triggered.

## Initial keyboard focus regression

The next clean paired run at docs `7179808` and framework `30167c8` passed all thirteen pre-browser site gates but failed 45 accessibility cases (77 passed, one existing skip). Hosted docs `1fd5825` also failed three representative-page checks. These results supersede any inference that the earlier 122-pass run established stable initial keyboard access.

An independent browser capture showed wide code blocks were scrollable but had no focus target at initial navigation. The renderer added `tabindex="0"` after its delayed resize/idle callback. The fix now emits the focus target through the supported code-render hook. The renderer retains it for overflow and removes unneeded stops when content fits. The height-cap correction remains in place. An artifact check now rejects code blocks that lack initial keyboard access, while the existing browser accessibility assertions remain unchanged.

The first local rebuild reused cached content HTML and the new artifact assertion correctly failed. The stale generated data store was preserved in `work/initial-focus-stale-data-store.json`, then only that isolated cache file was removed for a fresh build. The fresh artifact passed all 93 pages and twenty complete archives. Earlier logs and traces remain distinct from the focused and final results that follow.

The focused browser matrix passed all nine tests across desktop, tablet and mobile (20.5 seconds), including the hosted representative-page failures and the wide Dockerfile/matrix tutorials. The final pin is `9090a761f819014b905db6bb448388a534bb3943`, which additionally fixes portable paths in complete package manifests. Its source-matched imports and archives are regenerated in the same change. Full local underlying-site and hosted paired verification remain explicit final gates.

## Final paired evidence

Documentation code under test: `b250fb5a3290e626377895cb4e9d7b153da2622a`. Framework source: `9090a761f819014b905db6bb448388a534bb3943`. Both checkouts were clean for the final local site run. This checkpoint is a later evidence-only change; it does not alter the tested site or packages.

The unchanged fourteen underlying site commands passed locally, including 122 browser tests in 2.5 minutes. Only the existing duplicate generic mobile search test was skipped; all new cookbook tests executed. The structured command report is `work/final-site-b250fb5/result.json`, SHA-256 `8d7305dbe517420cc73099160a2a89db6eeb91c1fdd5c386e8cc0833382870ae`. Final desktop/mobile cookbook and recovery screenshots were visually inspected. The static focus target also survived the renderer callback, and ArrowRight scrolled the focused wide code block.

[Hosted paired validation](https://github.com/opensourceops/opensourceops.github.io/actions/runs/34023475777) passed the full `pnpm verify:agentctl` command using Node 24.4.1, pnpm 11.9.0 and Rust 1.88.0. The browser matrix passed 122 tests in 4.9 minutes with the same existing skip. Validation succeeded and deployment was explicitly skipped. This resolves the documentation's combined-gate evidence gap on Linux; the earlier local host failures remain recorded.

The actual uploaded `agentctl-pages-validation` artifact, ID `9986406081`, was downloaded and independently verified. Its 4,342,725 bytes hash to `cd191d9d11940958f72764abfa3d887f4e22c8ba13f7a049b5a0f756d7794dfc`, matching the Actions digest. It contains `.nojekyll`, 93 HTML pages, the exact clean framework source metadata, twenty complete example ZIPs, and matching digests for every nested package manifest entry. No visible “Canonical source:” boilerplate was present. The archive's recorded retention ends on 20 September 2026.

Evidence is retained in `work/hosted-final/`: the downloaded ZIP, API artifact metadata, full hosted log and independent verification report. `work/final-docs-evidence.json` combines those results with command, catalog and screenshot hashes. [The existing documentation draft PR](https://github.com/opensourceops/opensourceops.github.io/pull/6) remains paired with [the framework draft PR](https://github.com/opensourceops/agentctl/pull/7). The documentation is ready for review against these source commits; the framework's release verdict is recorded separately. No public deployment or paid provider call was performed by this documentation work.

## Windows service prerequisite revision

The next framework source is `4a22f7f733c5c722263b956b59f36107ec398fc7`. Hosted Windows execution exposed Python's socket startup prerequisite in the environment-cleared child. The framework now declares `SYSTEMROOT` only for local service-probe actions on Windows, with the matching policy grant and conflict/missing-prerequisite checks. Tutorials 14 and 17 explain that declared prerequisite. This site revision imports those reviewed changes and regenerates all complete packages against the new clean source.

The passing docs `b250fb5` / framework `9090a76` checkpoint and its evidence-only docs commit `3577670` remain valid for their recorded sources. Its actual downloaded package manifests were additionally byte-identical to those used by the twenty passing installed-binary direct journeys. New source checks and artifact evidence follow separately; earlier successful or failed runs are not relabeled.

The focused spelling check initially reported six occurrences of the new Windows environment variable name. `SYSTEMROOT` was added as one precise dictionary term; no assertion or prose-check exclusion changed.

## Windows-corrected paired evidence

Code under test: docs `8b3cdda50dea34a7282365f0d09dc7eef219848c`, framework `4a22f7f733c5c722263b956b59f36107ec398fc7`, both clean for the local run. All fourteen local site components passed, including 122 browser tests in 2.9 minutes with only the existing duplicate generic mobile search test skipped. The report `work/final-site-8b3cdda/result.json` hashes to `d491e2832415211a855c622fafc1876076650962d1856f669389fe24b559e682`. Updated desktop/mobile screenshots were visually inspected.

[The new hosted paired run](https://github.com/opensourceops/opensourceops.github.io/actions/runs/34024704916) passed full `pnpm verify:agentctl`, including 122 browser tests in 3.8 minutes and the same existing skip. Validation succeeded; deployment was skipped. The actual downloaded artifact `9986762734` contains 4,358,390 bytes and hashes to `3ca6d20ecce358c40981be658a254fd9935437ca143c1a6b2c8fa34144af7333`, matching the Actions digest. Independent verification passed `.nojekyll`, 93 HTML pages, clean exact-source metadata, all twenty complete package ZIPs and every nested manifest digest, and absent visible source boilerplate.

New artifacts and logs are retained separately under `work/hosted-4a22f7f/`; `work/final-docs-evidence-8b3cdda.json` consolidates the result and hashes. Earlier source checkpoints remain unchanged. This final ledger addition is evidence-only; it does not alter the tested site, workflow pin or download bytes. No paid call or deployment was performed.
