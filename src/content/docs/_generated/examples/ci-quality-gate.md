---
title: "CI quality gate"
description: "Turn typed evidence into stable process output."
editUrl: "https://github.com/opensourceops/agentctl/edit/c223d012727a75de62112923d4da8befbe2068f2/docs/use-cases/CI_QUALITY_GATE.md"
---
## Problem

A generic OCI pipeline step must convert typed evidence into a stable success or failure, emit one machine-readable result, and preserve enough state for diagnosis.

## Why agentctl fits

The workflow separates inputs from a deterministic assertion. The CLI returns a stable exit code and JSON envelope, while the CI platform retains `/state` and `/artifacts`.

## Complete workflow

Source: `examples/docs/ci-quality-gate/workflow.yaml`.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: ci-quality-gate
  description: Convert reviewed CI evidence into a stable process result.
spec:
  inputs:
    checksPassed: true
  outputs:
    verdict: "${{ tasks.verdict.output.output.value }}"
  actions:
    assert:
      kind: builtin.assert
    assign:
      kind: builtin.assign
  tasks:
    - id: gate
      uses: action:assert
      with:
        that: "${{ inputs.checksPassed }}"
        message: CI quality gate failed
    - id: verdict
      uses: action:assign
      needs: [gate]
      with:
        value: pass
```


## Run it

```text
agentctl run examples/docs/ci-quality-gate/workflow.yaml \
  --db /tmp/ci-quality-gate.db --output json --color never
```

The default exits `0` with verdict `pass`. Run with `--input checksPassed=false` to exercise the failed gate and exit `4`.

## State and security

Use ordinary typed inputs for non-secret gate evidence. Inject provider secrets
only through typed environment or mounted-file references. Archive the database
on failure only when its potentially confidential content is protected.

## Current limitation

This workflow does not run tests itself. A surrounding pipeline can supply results, or a reviewed `builtin.shell.exec` action can run a specifically allowed executable.
