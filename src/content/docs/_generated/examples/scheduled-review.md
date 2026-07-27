---
title: "Scheduled operational review"
description: "Produce durable state and artifacts from an external schedule."
editUrl: "https://github.com/opensourceops/agentctl/edit/main/docs/use-cases/SCHEDULED_REVIEW.md"
---
## Problem

An external scheduler needs to run a bounded check, retain state, and collect a report without an interactive session.

## Why agentctl fits

The CLI has a non-interactive process contract, explicit state and artifact paths, durable failures, structured output, and safe cancellation. Cron, systemd, or Kubernetes owns the schedule and overlap rule.

## Complete workflow

Source: `examples/docs/scheduled-review/workflow.yaml`.


```yaml
apiVersion: agentctl.dev/v1alpha1
kind: Workflow
metadata:
  name: scheduled-operational-review
  description: Produce a deterministic artifact for an external scheduler.
spec:
  inputs:
    reportPath: artifacts/operational-review.txt
    status: healthy
  outputs:
    artifact: "${{ inputs.reportPath }}"
  policy:
    workspaceRoot: .
    writableRoots: [artifacts]
    approval: never
  actions:
    assert:
      kind: builtin.assert
    write:
      kind: builtin.write
  tasks:
    - id: verify-status
      uses: action:assert
      with:
        that: "${{ inputs.status == 'healthy' }}"
        message: operational status is not healthy
    - id: report
      uses: action:write
      needs: [verify-status]
      with:
        path: "${{ inputs.reportPath }}"
        content: scheduled operational review passed
```


## Run it

From a copy of the example directory:

```text
mkdir -p artifacts .agentctl
agentctl run workflow.yaml --db .agentctl/runtime.db \
  --timeout-seconds 300 --output json --color never
```

Expected output declares `artifacts/operational-review.txt`. The file contains `scheduled operational review passed`.

## State and security

Persist the database and artifact directory with restrictive permissions. Configure `flock`, systemd serialization, or Kubernetes `concurrencyPolicy: Forbid` when overlapping external effects are unsafe.

## Current limitation

`agentctl` is a schedulable runtime, not a scheduling service. It does not provide clocks, calendars, distributed leases, or log rotation.
> Canonical source: [`docs/use-cases/SCHEDULED_REVIEW.md`](https://github.com/opensourceops/agentctl/blob/main/docs/use-cases/SCHEDULED_REVIEW.md). Verified against agentctl commit `c6a031015eed6ea7188c02b4ce28f7b451ea94f8`.
