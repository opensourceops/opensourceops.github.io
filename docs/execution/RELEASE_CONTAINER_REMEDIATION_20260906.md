# Release, containers and remediation documentation execution

## Starting sources and ownership

Framework main was pulled at `cddf1cd0634616cca34f6a7a43acf19c500631c7` and documentation main at `d64d62b7e4277d8e7e48203900697a8397298ccb`. Work continues on `codex/release-containers-remediation` and `codex/release-remediation-docs`. Earlier review branches, evidence and artifacts remain preserved.

This documentation work owns the site source, templates, imports, navigation, validation and later exact-source generated assets. Approved framework prose ownership covers README; product, limitations, compatibility and container guides; installation, first-use, CI, secret-reference and troubleshooting prose; the cookbook index and existing twenty tutorial READMEs. Release implementation, provider configuration, the new remediation example and framework execution ledger remain with their assigned owners. No publication, deployment or paid provider call is part of this documentation work.

## Evergreen contract

- Public introductions, titles, navigation and tutorials no longer use maturity labels or product release numbers as branding.
- Functional workflow/protocol identifiers, dependency pins, fixture refs, source SHAs, checksums and internal runtime metadata remain intact.
- Source installation remains pinned to the exact framework revision. Stable release links are used for native downloads. Published image usage is conditional on actual publication; local source builds cover unreleased changes.
- Five historical execution imports are replaced with short evergreen pages at the same routes. They link to the preserved source records and current operational guidance. Historical source files are unchanged.
- The homepage keeps source provenance but no longer prints the runtime version as product branding. The importer no longer regenerates retired labels.

## Initial validation

Three focused branding-contract tests passed. They reject retired product labels and the old registry placeholder, preserve API identifiers, dependencies, digests and fixture refs, and distinguish visible HTML text from machine metadata. Running the new artifact guard against the earlier built site correctly failed on its visible branding; the diagnostic is retained under the task evidence directory. This is regression evidence, not a passing new-source site build.

The final framework source pin, generated downloads, image invocations and full paired build remain pending implementation integration. No earlier green check is applied to this task's changed source.

## Container integration decisions pending implementation

The minimal image retains the agentctl entrypoint. The proposed tooling image adds a shell, Python and Git under the same image repository, without a Docker socket or GitHub publisher token. The implemented targets are `minimal` (the default final target) and `tooling`, both with the agentctl entrypoint and default UID/GID 65532. Tooling includes a shell, Python, Git and the required packaging/YAML modules. Exact final image identities and runnable platform evidence remain pending integration. The demo runs in its own repository; trusted outer CI owns build, scan and publication effects that are outside agentctl replay.

Official documentation inspected for this increment: [Docker run syntax and image references](https://docs.docker.com/engine/containers/run/), [GitHub stable release links](https://docs.github.com/en/repositories/releasing-projects-on-github/linking-to-releases), and [Harness Run step settings](https://developer.harness.io/3k-docs/continuous-integration/use-ci/run-step-settings/). Harness command scripts require their selected shell and executables in the execution image. Vendor syntax review does not establish hosted Harness execution.

## Next gates

1. Integrate the implemented minimal/tooling image contract and the complete remediation package/export interface.
2. Update maintained container, CI and secret-reference commands, then validate their actual local journeys and declared vendor scope.
3. Pin the reviewed final framework commit, regenerate imports/downloads and run freshness, source, branding, writing, schema, artifact, links, anchors, search, Mermaid and responsive browser/accessibility checks.
4. Push paired draft PRs and preserve exact tested source and hosted artifact identities. The maintainer performs the actual release and public deployment separately.

## Container authoring checkpoint

The container guide now provides a complete credential-free greeting workflow with an external variable file, a policy-authorized report mount, direct inspection and networkless replay. Reviewed configuration is mounted under `/workspace/config`; the state and report host directories are not also exposed through the workspace read mount. Host-owned private writable directories use an explicit matching non-root UID/GID, while the image default remains unchanged.

GitHub Actions guidance uses a hosted-runner Docker invocation and digest-selected image. Harness guidance uses a tooling image with `Sh` and no nested Docker, explicitly labeled vendor syntax review. Secret-file guidance keeps secrets and state outside the source workspace. The architecture, environment/path reference and deployment diagram now match this file-origin contract; ADR 0007 retains its original decision with a current implementation clarification.

Preliminary authoring evidence is retained in the task evidence directory: five YAML blocks parse without duplicate keys, seven standalone shell blocks pass `sh -n`, and the complete first-run workflow passes `check` using the existing local debug executable. Four changed guide files pass Markdown lint. These checks do not claim execution by the forthcoming image or hosted CI. The new independently exported remediation tutorial and final exact-source paired build still await their implementation artifacts.

## Preliminary image execution

Both local ARM64 development images passed the authored image workflow through Podman as host UID/GID `502:20`, with no network, read-only root/configuration and separate private writable state/report directories. The minimal image ID is `04ebbda8366f48ad80538569b3c1f5e3bef7739232bdabee48c5ad031ad61640`; tooling is `efafef5df678e9e83c93e72a84212caa36aa988ff0e64ed946e0b79d8a3ac2b3`. These are dirty development images and are not final-source release evidence.

Version, check, plan, run and inspect passed. After removal of the external variable file, offline replay returned the same output and preserved the exported file's hash and modification time. Replay inspection contained zero effects, provider sessions and tool calls. The tooling shell additionally verified non-root identity, read-only input/root paths, writable state/reports, absence of a workspace state alias, Git, and the Python packaging/YAML modules.

The machine contract observed is `RunOutcome.data.output` (singular), with `runId`, `traceId` and `state`; `RunInspection.data` includes `effects`, `providerSessions` and `toolCalls` arrays. The first evidence-driver attempt incorrectly asserted an `outputs` key after successful runs. Those failed harness attempts are preserved; the corrected second attempts passed. No provider request was made. The task evidence directory contains both attempts, exact commands and streams, a reusable final-image walkthrough driver, and the consolidated `development-image-walkthroughs.json` report.

## Independent remediation download integration

The website now invokes the canonical remediation exporter with `--framework-sha`, `--output` and `--archive`. Its ZIP and one-entry catalog live under `downloads/remediation`; the original twenty-package catalog and validation inventory remain unchanged. The new tutorial has a stable route, navigation and learning-path entries, with dedicated download, search and accessibility assertions.

The artifact verifier checks the independent ZIP's complete application/workflow/adapter/CI file set, regular portable paths, manifest digests, trusted framework SHA, bootstrap repository identities and standalone README links. Package `sourceDirty` describes the package's narrower source scope; site `dirty` describes the whole framework checkout. Dirty previews remain explicitly labeled, and a clean site cannot contain a dirty package. Final sync and execution of these artifact/browser checks await the completed tracked tutorial and final framework source.

The minimal image additionally rejected `/bin/sh`, `/usr/bin/python3` and `/usr/bin/git` as entrypoints with exit `127` and missing-file diagnostics, matching the image-choice table. These negative probes were credential-free and networkless and are recorded separately from the successful tooling inventory.

The literal tooling-entrypoint example also passed. An adverse check using the retired `/config` mount failed before execution with `Error`, exit `2`, `schema_violation` at `spec.varsFiles[0]`, and null run/trace IDs because the external variable source escaped the workspace. Its first probe expected policy exit `3`; that expectation failure is retained. The reviewed observation asserts the exact source-validation exit `2` and diagnostic rather than rerunning an already observed denied operation.

## Integrated source checkpoint: framework 617e1a3

The site was synchronized against clean framework `617e1a3a3ef91e40ca2289d86654b1beacaa35a6`, importing 80 source pages and building separate catalogs for the original twenty examples and the new remediation package. The current framework draft is [PR 8](https://github.com/opensourceops/agentctl/pull/8).

The required paired command stopped in framework `docs-verify`: `examples/v1/reusable-pack.yaml` retained a lock generated for the previous engine version. The exact CLI diagnostic was isolated with provider credentials removed from that check process. This is a failing paired result; the framework owner is correcting the lock and integrating the explicit live-preflight operation before providing another source pin.

Independent site components passed on this checkpoint: generated freshness, writing/branding, Mermaid, workflow pins, Markdown, spelling across 96 files, Astro checks across 28 files with zero errors/warnings, build, external links, Pagefind, all 94 HTML routes/links/anchors, and both complete source/digest-verified download catalogs. Initial browser startup without elevated loopback access failed with `EPERM`; the required browser phase was then run with authorized local-server access.

The browser phase passed 140 checks in 2.6 minutes. One existing generic mobile-search matrix case remains skipped; the dedicated twenty-cookbook and independent-remediation search checks passed on mobile, as did their download, layout and accessibility checks. Desktop remediation and mobile container/table/YAML screenshots were also inspected. The visible product branding is evergreen, source SHA provenance is retained, and code stays horizontally scrollable and copyable. No site deployment or paid call occurred.

Logs and screenshots are retained in the new task's `docs` evidence directory, including `paired-617e1a3-attempt1.log`, `site-617e1a3-attempt1.log` and `browser-617e1a3-attempt1.log`. These passing site components do not change the failed paired verdict or establish final-source evidence. The next integrated framework SHA will be pinned and regenerated before the required final paired verification.

## Integrated source checkpoint: framework 732fef4

Framework `732fef49fc8cde02e75f8e9d50974fe6cc816e9b` corrected the reusable-pack lock and example-runner inventory. Its full `cargo xtask docs-verify` passed inside the paired command. The site regenerated 80 imports and both download catalogs, including mandatory preflight workflow/helper files. The preflight tutorial describes the recorded 8,000-token ceiling; older 3,000-token fixture evidence is not reused as current proof.

The paired command passed source freshness, writing/branding, Mermaid, workflow pins, Markdown, spelling, Astro/build and all 94-page artifact/link/anchor/package checks, then failed on an authentication-only repository settings URL returning HTTP 404. The framework release-guide owner was asked to replace that public link with a repository link and the Settings navigation breadcrumb. The external-link assertion remains unchanged. The log is `paired-732fef4-attempt1.log`; this is not a passing paired run. Browser checks were not repeated on the already failed checkpoint.

The mandatory Markdown command now explicitly includes the five maintained compatibility/history explanation pages under `concepts` and `reference`, matching their earlier focused checks. This keeps those preserved routes inside CI coverage after their historical generated imports were removed.

## External-link transport correction

The paired command at clean framework `46a8923328e5730fe508140b419c130d2a2884e8` passed framework documentation verification and site checks through external URL classification, then remained alive because the fetch transport retained two TCP socket resources. Diagnostic attempts reproduced the leak, including an attempted Connection-close header. The original command and two diagnostic copies were terminated only after their exact commands and working directories were verified. Their exit `143` logs remain failed or interrupted evidence; no paired pass is claimed.

The checker now uses unpooled native HTTP(S) requests, destroys each response after reading its status and retains the existing overall 15-second timeout, redirect bound, TLS defaults and status classifications. Four focused real-server tests cover redirects, HTTP 404, an unfinished response body, timeout and redirect cycles without forcibly closing server connections. All passed. The actual 171 exact-source objects and 16 external URLs then passed and the checker exited normally. Logs are `external-status-tests.log`, `external-native-46a8923.log` and `stopped-link-check-processes.json`; prior diagnostic logs are preserved.

The next paired source pin is framework `f54ccd6e3f96e10ea57bc5585f80b3e68a92aaab`, which also contains the framework release preparation provenance correction. The demo bootstrap pull request is distinct from a model-produced remediation pull request. Live remediation evidence remains with the framework owner and is not inferred from the website build.

## Passing paired checkpoint: framework f54ccd6

The full `AGENTCTL_REPO=... pnpm verify:agentctl` command passed against clean framework `f54ccd6e3f96e10ea57bc5585f80b3e68a92aaab` with pnpm 11.9.0. Framework documentation verification, generated freshness, writing/branding, Mermaid, workflow pins, Markdown, spelling, Astro checks/build, all 94 HTML pages and their links/anchors, both download inventories, external source/URL checks and search passed. The external checker exited normally, allowing the browser phase to run in the same command.

Responsive browser checks passed 140 cases in 2.5 minutes. One unchanged generic mobile-search matrix case is skipped; the dedicated original twenty-package and independent remediation mobile search/download/accessibility checks all passed. The paired log is `paired-f54ccd6-attempt1.log`; `checkpoint-f54ccd6.json` records its hash and source metadata. No provider call, production publication or Pages deployment occurred.

The framework owner is preparing a Windows test-only correction. This successful source checkpoint remains preserved, and the final documentation pin and generated source assets will advance together if that correction changes the reviewed framework SHA.

## Reviewed source: framework 68e5b8e

Clean framework `68e5b8e738f099487c7af9fe1b043ab2c1a5d0b0` adds a Windows mount-construction test correction and execution evidence after the preceding checkpoint. The site workflow pin, 80 imports and all twenty original plus one independent download packages were regenerated together. The complete local paired command passed again, including 140 responsive browser cases in 2.5 minutes and the same one existing generic mobile-search skip. Dedicated mobile search, download, copy and accessibility assertions passed. `paired-68e5b8e-attempt1.log` is the exact-source log.

The documentation source is ready for a draft pull request paired with framework PR 8. The PR workflow validates the exact source and uploads its complete site ZIP; its deployment job is excluded from pull-request events. Hosted verification and the uploaded ZIP digest are recorded separately after that run completes. The demo bootstrap PR is not a model-generated remediation PR, and this documentation result supplies no live-provider or production-publication claim.

## Hosted paired proof and actual uploaded artifact

[Documentation draft PR 7](https://github.com/opensourceops/opensourceops.github.io/pull/7) tests documentation source `35d15cd26d693d21f67d9e13992fa96b72784c2c` with framework `68e5b8e738f099487c7af9fe1b043ab2c1a5d0b0`. [Hosted run 34052645754](https://github.com/opensourceops/opensourceops.github.io/actions/runs/34052645754) passed the full paired command in the validation job (8 minutes 26 seconds). Its browser phase passed 140 cases in 5.1 minutes with the unchanged single generic mobile-search skip. All dedicated mobile package/search/accessibility checks passed. The hosted checkout verified 166 exact source objects locally and the remaining 21 external URLs without a definite failure; the deeper local checkout verified 171 objects and 16 URLs. Deployment and production Pages upload were skipped.

The actual uploaded `agentctl-pages-validation` ZIP, artifact ID `9995138253`, is 4,365,690 bytes. Its SHA-256 is `4467a92dbaa8bb9abeaf49472fe6d16a4469c9f0e105a6486cbad9965ec89572`, identical to the Actions artifact digest. Independent verification confirms `.nojekyll`, clean exact framework metadata, all 94 HTML pages without visible source boilerplate or retired public branding, twenty original cookbook ZIPs and the independent remediation ZIP. Every offered package is byte-identical to the locally validated source package; all nested file digests and source-bound manifests pass. This proves packaging and website relationships, not execution of the paid remediation journey.

The artifact expires on 20 September 2026 at 18:52:18 UTC. The retained evidence directory contains the actual ZIP, Actions metadata, complete hosted log and `hosted-68e5b8e/verification.json` (SHA-256 `ecf430184ec1dfefce9f466027151230179b7b8b598386cd8f29fa81ff6e0bd4`). Its package records include ZIP and manifest hashes for independent comparison with framework execution evidence. The evidence-only documentation commit following `35d15cd` changes this ledger alone; tested site source and the framework pin remain unchanged. Only writing, Markdown and diff checks are repeated for that record.
