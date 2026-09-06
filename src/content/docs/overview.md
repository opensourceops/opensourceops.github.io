---
title: Overview
description: Understand the problem agentctl solves, its control model, supported boundaries, and the fastest path to useful evidence.
---

`agentctl` runs reviewed declarative workflows that combine deterministic actions with narrowly bounded model reasoning. The graph, policy, state machine, effect ledger, approvals, and recovery rules stay outside the model.

## Choose your next step

- **Evaluating the project:** Read [Why agentctl](/agentctl/why-agentctl/) and [current limitations](/agentctl/reference/limitations/).
- **Running it now:** Complete [Getting started](/agentctl/getting-started/) with no provider credential.
- **Using an image:** Run the [first container workflow](/agentctl/guides/container/#run-your-first-image-workflow), then choose the image flavor and writable mounts for CI.
- **Trying a tool-using agent:** Run the [first agent workflow](/agentctl/getting-started/first-agent/) with the deterministic fake provider.
- **Authoring YAML:** Learn the [workflow model](/agentctl/guides/workflow-authoring/) before reading the field reference.
- **Operating it:** Choose a [deployment model](/agentctl/deployment-model/), then review [durable execution](/agentctl/durable-execution/).
- **Contributing:** Start with the [developer guide](/agentctl/contributing/developer-guide/).

## The control model

1. Strict YAML declares inputs, outputs, tasks, dependencies, actions, agents, tools, policies, memory, and protocols.
2. The compiler validates references and provider capabilities, then creates a declaration-ordered DAG and plan digest.
3. The runtime executes one ready task at a time. Model tasks have explicit tool, turn, token, and time limits.
4. Non-pure effects are recorded before dispatch. Important state changes commit with checkpoints and audit evidence.
5. Resume reuses confirmed work, recorded replay calls no executor, and fork makes fresh effects explicit.

## Supported boundaries

The workflow API is `agentctl.dev/v1`. Use [capability matrices](/agentctl/reference/capabilities/)
to choose a provider and [operational limits](/agentctl/reference/limitations/)
to choose an execution environment. Compilation rejects unsupported provider features.

Recorded replay reconstructs captured results without new effects. Fresh model
responses and external systems can vary. Policy allowlists do not create an
operating-system sandbox; use an appropriate container or isolated runner for
untrusted work. CI and external schedulers retain control of triggers and overlap.

## Source of truth

Technical behavior comes from the [`agentctl` repository](https://github.com/opensourceops/agentctl). This site imports canonical guides, checked examples, generated CLI help, and the generated workflow schema during each build. The source commit is available in the homepage footer and at [`/agentctl/meta/agentctl-source.json`](/agentctl/meta/agentctl-source.json).

The exact-source installation command and cookbook downloads match this build's framework revision. A draft PR preview can therefore describe files that are not on the repository's `main` branch or the deployed public site yet. Use the revision shown in this build; do not substitute a previously published binary or assets from a different revision.
