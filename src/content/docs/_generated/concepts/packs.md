---
title: "Reusable packs"
description: "Use versioned local content with integrity verification."
editUrl: "https://github.com/opensourceops/agentctl/edit/main/docs/PACKS.md"
---
A pack is reviewed reusable YAML content, not executable plugin code. Its manifest API is `agentctl.dev/pack/v1alpha1` and declares a fully qualified dotted name, semantic version, agentctl semver constraint, actions, agents, tool contracts, capabilities, provider requirements, and optional policy defaults.

`agentctl packs inspect` strictly parses the manifest, validates the API version, name, versions, and compatibility with the running binary. `agentctl packs verify` compares a `sha256:` integrity digest for a local manifest or archive. Workflow pack references carry name, version, local path, and integrity. The CLI verifies a referenced manifest, keeps it beneath the workflow directory, and loads actions, agents, and tools as `<pack-name>.<item-name>` before compilation.

Dependency resolution, transitive lockfile generation, Git fetching, reusable sub-workflows, policy-default merging, a hosted registry, native dynamic libraries, and pack processes are not implemented. A checked-in pack reference is therefore an integrity/provenance contract for local content, not a package manager. Manifest policy defaults are inspectable metadata and never weaken the invoking workflow’s policy.
> Canonical source: [`docs/PACKS.md`](https://github.com/opensourceops/agentctl/blob/main/docs/PACKS.md). Verified against agentctl commit `1e8b133f13e9325bc00dbfcdcdfd5d8dd5517889`.
