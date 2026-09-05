---
title: Examples and use cases
description: Start from complete checked workflows for repository review, release gates, scheduled runs, CI, approvals, repair, replay, and providers.
---

This site imports guides and examples from the framework checkout recorded in its source metadata. Normal verification uses deterministic actions, the fake provider, or local protocol mocks. Live provider examples are opt-in and labeled; a successful static check does not establish execution evidence.

## DevOps and CI/CD suite

The [twenty-example DevOps suite](/agentctl/examples/devops/) covers build and test diagnosis, configuration reviews, release decisions, drift, incident timelines, governed local deployment, and recovery. Its [machine-readable catalog](https://github.com/opensourceops/agentctl/blob/main/examples/devops/catalog.json) records platforms, prerequisites, expected exit codes, fixture or live modes, artifacts, and evidence status.

From the framework checkout, run:

```text
cargo xtask devops-examples
```

Read the suite guide for clean-directory execution, per-example commands, bounded OpenAI variants, and cleanup. Local service fixtures demonstrate policy and recovery behavior; their results do not establish a production deployment. Live evidence applies only to the exact workflow, provider, and source revision recorded by its run.

## Choose an example

- [Repository audit](/agentctl/examples/repository-audit/): a bounded agent reads a fixture, then deterministic tasks verify and write the report.
- [Release readiness](/agentctl/examples/release-readiness/): deterministic gates must pass before bounded analysis runs.
- [Scheduled operational review](/agentctl/examples/scheduled-review/): an external scheduler invokes one durable non-interactive run.
- [CI quality gate](/agentctl/examples/ci-quality-gate/): typed evidence becomes a stable exit code and JSON result.
- [Approval-gated action](/agentctl/examples/approval-gated/): policy pauses a mutation for operator review.
- [Selective workflow repair](/agentctl/guides/selective-repair/): reuse compatible upstream output and execute a corrected failed suffix.
- [Offline recorded replay](/agentctl/examples/recorded-replay/): a terminal result is reconstructed without executors.
- [Provider portability](/agentctl/examples/provider-portability/): one neutral agent shape uses fake and OpenAI configurations with distinct evidence levels.
- [Framework completeness](/agentctl/concepts/framework-completeness/): combine parallel tasks, bounded expansion, routing, loops, sub-workflows, compensation, protocols, and typed handoffs.
- [Live framework verification](/agentctl/reference/live-framework-verification/): inspect sanitized GPT-5.6 recovery, replay, streaming, usage, and container evidence.

## Verification levels

| Label | Meaning |
| --- | --- |
| Deterministic | Runs locally without a model or remote protocol. |
| Mock-backed | Uses the real adapter or agent loop against deterministic local behavior. |
| Retained live evidence | A bounded live run was recorded previously and sanitized. |
| Static validation | YAML or platform syntax is checked, but the hosted system did not execute it. |
| Opt-in live | Requires an explicit credential and network call outside normal verification. |

Run `cargo xtask docs-verify` in the canonical repository to validate documentation examples without provider credentials.
