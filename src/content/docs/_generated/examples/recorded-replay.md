---
title: "Offline recorded replay"
description: "Reconstruct a terminal run without credentials or effects."
editUrl: "https://github.com/opensourceops/agentctl/edit/main/docs/use-cases/RECORDED_REPLAY.md"
---
## Problem

An operator needs to reconstruct the outcome of a completed provider-backed run without credentials, network access, or repeated effects.

## Why agentctl fits

Recorded replay reads terminal stored task output and effect records. It creates a linked replay record but never calls provider, tool, network, process, filesystem, MCP, or A2A executors.

## Example workflow

Source: `examples/v1/crash-resume.yaml`.


```yaml
apiVersion: agentctl.dev/v1alpha1
kind: Workflow
metadata:
  name: crash-resume
spec:
  policy:
    workspaceRoot: .
    writableRoots: [artifacts]
    approval: never
  actions:
    write:
      kind: builtin.write
    read:
      kind: builtin.read
  tasks:
    - id: write
      uses: action:write
      with: { path: artifacts/resume.txt, content: written-once }
    - id: read
      uses: action:read
      needs: [write]
      with: { path: artifacts/resume.txt }
```


## Run and replay

```text
mkdir -p examples/v1/artifacts
agentctl run examples/v1/crash-resume.yaml --db /tmp/replay.db \
  --output json --color never
agentctl replay RUN_ID --db /tmp/replay.db --output json --color never
```

Use the terminal source run ID returned by the first command. The replay has its own run ID and links to the source.

## State and security

Replay needs only the database, but the stored record may contain confidential input and output. It reproduces recorded truth, not current files or remote state.

## Current limitation

Replay is not a new validation, retry, or exactly-once guarantee. It rejects non-terminal source runs. Use resume for safe continuation and fork only when fresh effects are intentional.
> Canonical source: [`docs/use-cases/RECORDED_REPLAY.md`](https://github.com/opensourceops/agentctl/blob/main/docs/use-cases/RECORDED_REPLAY.md). Verified against agentctl commit `1e8b133f13e9325bc00dbfcdcdfd5d8dd5517889`.
