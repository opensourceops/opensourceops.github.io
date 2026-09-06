---
title: "Repository audit"
description: "Bound repository reads and verify the resulting report."
editUrl: "https://github.com/opensourceops/agentctl/edit/d388954c346865cb34c0f20a5f528e695ba39b8a/docs/use-cases/REPOSITORY_AUDIT.md"
---
## Problem

A model needs to inspect a repository and produce a report, but it should see only reviewed files and its conclusion must pass deterministic checks before becoming an artifact.

## Why agentctl fits

The workflow graph and policy are outside the model. A strict read tool limits the agent to the workspace, the fake provider makes the documented journey repeatable, an assertion checks the final marker, and a separate deterministic action writes the report.

## Complete workflow

Source: `examples/acceptance/mock-tool/workflow.yaml`.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: acceptance-mock-tool
spec:
  inputs:
    reportPath: artifacts/mock-report.txt
  outputs:
    verdict: "${{ tasks.inspect.output.text }}"
    artifact: "${{ inputs.reportPath }}"
  providers:
    fake:
      kind: fake
  policy:
    workspaceRoot: .
    writableRoots: [artifacts]
    approval: never
  tools:
    read_fixture:
      kind: builtin.workspace.read
      description: Read a UTF-8 file inside the authorized workspace.
      inputSchema:
        type: object
        properties:
          path: { type: string }
        required: [path]
        additionalProperties: false
      outputSchema:
        type: object
        properties:
          path: { type: string }
          content: { type: string }
          bytes: { type: integer }
          sha256: { type: string }
        required: [path, content, bytes, sha256]
        additionalProperties: false
      capability: filesystem.read
      risk: low
      effectClass: observe
      idempotency: idempotent
      retrySafe: true
      timeoutSeconds: 5
      approval: never
  agents:
    inspector:
      provider: fake
      model: scripted
      instructions: Read the fixture and report its marker.
      tools: [read_fixture]
      maxTurns: 2
      maxToolCalls: 1
      maxOutputTokens: 32
      timeoutSeconds: 5
      providerOptions:
        toolInput: { path: fixture/service.txt }
        finalText: AGENTCTL_MOCK_FIXTURE_VERIFIED
  actions:
    assert:
      kind: builtin.assert
    write:
      kind: builtin.write
  tasks:
    - id: inspect
      uses: agent:inspector
      with:
        prompt: Use read_fixture before answering.
    - id: verify
      uses: action:assert
      needs: [inspect]
      with:
        that: "${{ tasks.inspect.output.text == 'AGENTCTL_MOCK_FIXTURE_VERIFIED' }}"
        message: the mock provider did not complete its tool continuation
    - id: report
      uses: action:write
      needs: [inspect, verify]
      with:
        path: "${{ inputs.reportPath }}"
        content: "${{ tasks.inspect.output.text }}"
```


The repository acceptance suite copies this entire directory to a clean workspace and runs it.

## Run it

From the repository root:

```text
cp -R examples/acceptance/mock-tool /tmp/agentctl-repository-audit
cd /tmp/agentctl-repository-audit
agentctl check workflow.yaml
agentctl plan workflow.yaml
agentctl run workflow.yaml --db .agentctl/runtime.db --output json --color never
```

The run needs no credential and makes no network call. Expected output includes verdict `AGENTCTL_MOCK_FIXTURE_VERIFIED` and artifact `artifacts/mock-report.txt`.

## State and security

The database records the provider session, strict tool call, read effect, assertion, write effect, audit events, and trace correlation. The read tool cannot mutate the workspace. Replace the fake provider only after reviewing new credential, network, model, and output risks.

## Current limitation

The checked journey proves orchestration and tool boundaries, not the quality of a live model's repository analysis. Production workflows need task-specific verification stronger than a fixed marker.
