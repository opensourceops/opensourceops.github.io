---
title: "Installation"
description: "Build or install agentctl 0.3 with workflow API v1 from reviewed source."
editUrl: "https://github.com/opensourceops/agentctl/edit/4a22f7f733c5c722263b956b59f36107ec398fc7/docs/guides/INSTALLATION.md"
---
The Rust CLI and crates are **pre-1.0**. `agentctl.dev/v1` identifies the workflow document format; it does not mean the product is a stable 1.0 release. These tutorials use candidate features from the paired source revision. A previously published crate or container may not contain them.

## Install matching source

You need Git, Rust 1.88.0, and Cargo. Installation downloads build dependencies and needs no provider key. The documentation site renders the exact source revision and copyable command here:


This documentation describes candidate source [`4a22f7f733c5c722263b956b59f36107ec398fc7`](https://github.com/opensourceops/agentctl/tree/4a22f7f733c5c722263b956b59f36107ec398fc7). The CLI and crates are pre-1.0; workflow API `agentctl.dev/v1` names the document format. Install this exact candidate:

```sh
cargo install --locked --git https://github.com/opensourceops/agentctl --rev 4a22f7f733c5c722263b956b59f36107ec398fc7 agentctl-cli
agentctl version
```


When reading this file in a source checkout, install that checkout directly:

```sh
cargo install --locked --path crates/agentctl-cli
agentctl version
```

Run this command from the repository root. Cargo installs the executable into its binary directory, normally `~/.cargo/bin`; include that directory in your `PATH`. Keep the checkout's `git rev-parse HEAD` value with your installation evidence. The version string alone does not identify an unmerged candidate commit.

For an isolated installation, pass `--root /tmp/agentctl-candidate` and use `/tmp/agentctl-candidate/bin/agentctl`. On Windows, use a writable directory of your choice and its `bin/agentctl.exe`.

## Verify without a source checkout

Continue with [your first credential-free workflow](/agentctl/getting-started/). That page includes the entire YAML document. Once the binary is installed, no repository checkout, Python dependency, container engine, or provider key is needed for that first run.

The DevOps cookbook adds Python and case-specific tools. Download a complete matching example package from its tutorial; copying a workflow alone omits the helper, schemas, and input files it requires.

## Build a local package or image

From the reviewed source checkout:

```sh
cargo xtask package
```

The local `dist/` output includes the release binary, completions, license, README, and SHA-256 manifest. Building this package does not publish a release.

For container operation, build the same checkout with Docker or Podman:

```sh
docker build --tag agentctl:candidate --file Containerfile .
docker run --rm agentctl:candidate version --output json --color never
```

The image runs as UID/GID 65532 with `agentctl` as its entrypoint. Review the [container contract](/agentctl/guides/container/) before mounting a workspace or durable database. Record both the source commit and resulting image digest.

## Published versions and upgrades

This guide does not establish that a published crate or registry image contains the candidate changes. Use a published release only with documentation and artifacts verified for that release. Keep the source revision, binary checksum, and workflow assets together.

Before an upgrade, review [compatibility](/agentctl/reference/compatibility/) and [limitations](/agentctl/reference/limitations/), back up SQLite state using the [state guide](/agentctl/reference/database/), then run `check` and `plan` with the new binary. `agentctl update` explains installation paths; it does not replace your binary.
