---
title: "Release readiness"
description: "Combine deterministic gates with bounded analysis."
editUrl: "https://github.com/opensourceops/agentctl/edit/9090a761f819014b905db6bb448388a534bb3943/docs/use-cases/RELEASE_READINESS.md"
---
## Problem

A release process has deterministic evidence such as tests and a security scan, plus a bounded model summary. Model analysis must not override failed gates.

## Why agentctl fits

Dependencies keep the analysis task behind two assertions. The model can summarize only after deterministic gates pass. A pipeline consumes the final process status and declared output.

## Complete workflow

Source: `examples/docs/release-readiness/workflow.yaml`.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: release-readiness
  description: Gate bounded analysis behind deterministic release evidence.
spec:
  inputs:
    testsPassed: true
    securityScanPassed: true
  outputs:
    decision: "${{ tasks.analyze.output.text }}"
  providers:
    fake:
      kind: fake
  agents:
    reviewer:
      provider: fake
      model: scripted
      instructions: Summarize only the verified release evidence.
      maxTurns: 1
      maxToolCalls: 0
      maxOutputTokens: 64
      timeoutSeconds: 5
      providerOptions:
        finalText: RELEASE_EVIDENCE_REVIEWED
  actions:
    assert:
      kind: builtin.assert
  tasks:
    - id: verify-tests
      uses: action:assert
      with:
        that: "${{ inputs.testsPassed }}"
        message: test gate failed
    - id: verify-security
      uses: action:assert
      needs: [verify-tests]
      with:
        that: "${{ inputs.securityScanPassed }}"
        message: security gate failed
    - id: analyze
      uses: agent:reviewer
      needs: [verify-tests, verify-security]
      with:
        prompt: Summarize the verified test and security gates.
```


## Run it

```text
agentctl run examples/docs/release-readiness/workflow.yaml \
  --db /tmp/release-readiness.db --output json --color never
```

The credential-free example returns decision `RELEASE_EVIDENCE_REVIEWED`. Override `testsPassed=false` to verify that exit `4` prevents the model task from running.

## State and security

The database records which gate failed and whether the analysis task started. A real workflow should pass evidence through reviewed files or typed inputs, not give the model CI credentials or authority to change release state.

## Current limitation

The example uses the fake provider. It demonstrates graph and policy behavior, not a live model quality claim or a release approval system.
