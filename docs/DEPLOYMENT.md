# GitHub Pages deployment

The workflow in `.github/workflows/pages.yml` validates pull requests and deploys only from `main` or a manual dispatch. It checks out both repositories, runs the credential-free canonical and site gates, assembles `_site`, verifies `agentctl/index.html`, and uses GitHub's current Pages artifact deployment actions.

## Required repository settings after merge

1. Open the `opensourceops/opensourceops.github.io` repository settings.
2. Under **Pages**, set **Source** to **GitHub Actions**.
3. Keep the public custom domain empty unless OpenSourceOps intentionally adds one later.
4. Under **Actions**, allow GitHub-owned actions. No provider secret is required.
5. Protect `main` according to the organization's normal policy and require the `validate` job if desired.
6. Run the workflow manually once, or merge a validated change to `main`.
7. Confirm the deployment environment reports `https://opensourceops.github.io/` and verify `https://opensourceops.github.io/agentctl/` separately.

Do not configure Pages to deploy from a branch directory. The workflow uploads the complete `_site` artifact, including the organization root, `.nojekyll`, and the `agentctl/` subdirectory.

## Paired source updates

Use a clean, committed framework checkout for final verification. Set `AGENTCTL_COMMIT` in `.github/workflows/pages.yml` to its complete commit ID, then run:

```text
AGENTCTL_REPO=/path/to/agentctl pnpm docs:sync
git add src/content/docs/_generated src/data public/downloads public/meta
AGENTCTL_REPO=/path/to/agentctl pnpm verify:agentctl
```

The freshness gate compares regenerated content with the Git index, so stage reviewed generated changes before verifying an intentional source update. The gate remains strict for subsequent unexpected changes. Commit the source pin and generated files together after verification. Both source commits must be available on GitHub for the draft pull request to pass hosted validation. Cross-link the framework and site pull requests; merging and public deployment are separate review steps.

The metadata at `/agentctl/meta/agentctl-source.json` records each imported source path, public route, content SHA-256, framework commit, and whether that checkout had local changes. It carries provenance without adding a source paragraph to every guide. The artifact gate verifies that this metadata matches every generated page and rejects reintroduced source boilerplate.

## Security model

Pull requests receive read-only repository permission and never reach the deployment job. The deployment job alone receives `pages: write` and `id-token: write`. The workflow does not read provider credentials or repository secrets. All action references are immutable commit SHAs with release annotations.
