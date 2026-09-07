---
title: "Provider portability"
description: "Keep the workflow contract neutral while capability evidence stays honest."
editUrl: "https://github.com/opensourceops/agentctl/edit/9640102855bc513e2849d0a08344c1f13e50028a/docs/use-cases/PROVIDER_PORTABILITY.md"
---
## Problem

A workflow author wants one provider-neutral agent contract while retaining honest capability differences and evidence levels.

## Why agentctl fits

The core stores provider-neutral messages, tools, usage, errors, and continuation. Native adapters translate at the edge, and the compiler rejects requested features that the selected provider does not support.

## Credential-free variant

Source: `examples/docs/provider-portability/fake.yaml`.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: portable-summary-fake
  description: Credential-free provider portability fixture.
spec:
  outputs:
    summary: "${{ tasks.summarize.output.text }}"
  providers:
    selected:
      kind: fake
  agents:
    summarizer:
      provider: selected
      model: scripted
      instructions: Return one short evidence summary.
      maxTurns: 1
      maxToolCalls: 0
      maxOutputTokens: 64
      timeoutSeconds: 5
      providerOptions:
        finalText: PORTABLE_SUMMARY_VERIFIED
  tasks:
    - id: summarize
      uses: agent:summarizer
      with:
        prompt: Summarize the supplied evidence.
```


Run it with:

```text
agentctl run examples/docs/provider-portability/fake.yaml \
  --db /tmp/provider-fake.db --output json --color never
```

Expected summary: `PORTABLE_SUMMARY_VERIFIED`.

## Opt-in OpenAI variant

Source: `examples/docs/provider-portability/openai.yaml`.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: portable-summary-openai
  description: Opt-in OpenAI variant of the portable summary fixture.
spec:
  outputs:
    summary: "${{ tasks.summarize.output.text }}"
  providers:
    selected:
      kind: openai
      credential:
        env: OPENAI_API_KEY
  policy:
    networkAllowlist: [api.openai.com]
  agents:
    summarizer:
      provider: selected
      model: gpt-5.6
      instructions: Return one short evidence summary.
      maxTurns: 1
      maxToolCalls: 0
      maxOutputTokens: 64
      timeoutSeconds: 30
      reasoning:
        effort: low
  tasks:
    - id: summarize
      uses: agent:summarizer
      with:
        prompt: Summarize the supplied evidence.
```


Static validation needs no credential:

```text
agentctl check examples/docs/provider-portability/openai.yaml
agentctl providers inspect examples/docs/provider-portability/openai.yaml
```

Execution requires `OPENAI_API_KEY` in the environment, makes a paid network request, and is excluded from normal documentation verification.

## State and security

Both workflows share the provider-neutral agent shape. Each provider still needs its native credential, allowed host, model name, capability checks, timeouts, and error handling.

## Current limitation

Provider portability does not mean identical behavior or equal maturity. Fake is deterministic, OpenAI has retained bounded live evidence, and Azure OpenAI, Anthropic, and Google are mock-protocol tested only in this release.
