---
title: Overview
description: Understand the problem agentctl solves, its control model, current maturity, and the fastest path to useful evidence.
---

`agentctl` runs reviewed declarative workflows that combine deterministic actions with narrowly bounded model reasoning. The graph, policy, state machine, effect ledger, approvals, and recovery rules stay outside the model.

## Choose your next step

- **Evaluating the project:** Read [Why agentctl](/agentctl/why-agentctl/) and [current limitations](/agentctl/reference/limitations/).
- **Running it now:** Complete [Getting started](/agentctl/getting-started/) with no provider credential.
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

## Current maturity

The workflow API is `agentctl.dev/v1`. Agentctl 0.3 has exact-commit local and
hosted release evidence. Deterministic and fake-provider journeys have
executable local evidence, while Linux x64, macOS arm64, Windows x64,
container, security, package, SBOM, and release-preparation gates have hosted
evidence. Native provider and protocol evidence varies by adapter and is stated
in the [capability matrices](/agentctl/reference/capabilities/).

Workflow API `v1` names the document contract. The CLI and crates remain pre-1.0, and
this site does not claim long-term support, exactly-once execution, an
operating-system sandbox, distributed scheduling, or live validation across
every provider.

## Source of truth

Technical behavior comes from the [`agentctl` repository](https://github.com/opensourceops/agentctl). This site imports canonical guides, checked examples, generated CLI help, and the generated workflow schema during each build. The source commit is available in the homepage footer and at [`/agentctl/meta/agentctl-source.json`](/agentctl/meta/agentctl-source.json).

The candidate installation command and cookbook downloads match this build's framework revision. A draft PR preview can therefore describe files that are not on the repository's `main` branch or the deployed public site yet. Use the revision shown in this build; do not substitute a previously published binary or assets from a different revision.
