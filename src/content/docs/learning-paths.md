---
title: Learning paths
description: Follow a short path for evaluation, first use, workflow authoring, operations, CI/CD, or contribution.
---

## I am evaluating agentctl

1. Read [Why agentctl](/agentctl/why-agentctl/).
2. Review the [security model](/agentctl/security/) and [limitations](/agentctl/reference/limitations/).
3. Compare [provider and tool capabilities](/agentctl/reference/capabilities/).
4. Inspect the [architecture diagrams](/agentctl/architecture/diagrams/).

## I want to run my first workflow

1. [Install agentctl](/agentctl/getting-started/installation/).
2. Complete the credential-free [Getting started](/agentctl/getting-started/) tutorial.
3. Run the [first bounded agent workflow](/agentctl/getting-started/first-agent/).
4. Learn [local operation](/agentctl/guides/local-operation/).

## I want to run an image

1. [Choose minimal or tooling](/agentctl/guides/container/#choose-an-image) for the executables your reviewed workflow needs.
2. Run the complete [first image workflow](/agentctl/guides/container/#run-your-first-image-workflow) without credentials or network access.
3. Review [mounts and inputs](/agentctl/guides/container/#mounts-and-inputs) for instruction files, variables, reports and secrets.
4. [Inspect and replay](/agentctl/guides/container/#inspect-replay-and-recover) the retained run before integrating a pipeline.

## I want to author workflows

1. Learn to [author a workflow](/agentctl/guides/workflow-authoring/).
2. Read the [YAML reference](/agentctl/reference/yaml/).
3. Configure [variables and instruction files](/agentctl/guides/variables/), then study [tools and effects](/agentctl/concepts/tools/) and [policies and approvals](/agentctl/concepts/policies/).
4. Start from a [verified use case](/agentctl/examples/).

## I want to operate agentctl

1. [Choose a deployment model](/agentctl/deployment-model/).
2. Understand [durable execution](/agentctl/durable-execution/).
3. Configure [logs and observability](/agentctl/observability/).
4. Keep the [troubleshooting decision path](/agentctl/troubleshooting/) close to runbooks.

## I want to integrate agentctl into CI/CD

1. Read the [container contract](/agentctl/guides/container/).
2. Apply the [CI/CD integration guide](/agentctl/guides/ci-cd/) and the maintained [GitHub Actions](/agentctl/guides/container/#github-actions) or [Harness Run step](/agentctl/guides/container/#harness-ci-run-step).
3. Review the [CI quality gate example](/agentctl/examples/ci-quality-gate/).
4. Run the [DevOps and CI/CD suite](/agentctl/examples/devops/) and plan protected state retention for approvals and recovery.

## I want to contribute

1. Read the [contributor guide](/agentctl/contributing/).
2. Learn the [Rust workspace and effect boundaries](/agentctl/contributing/developer-guide/).
3. Run the [testing strategy](/agentctl/contributing/testing/).
4. Use the focused guide for an [action or tool](/agentctl/contributing/add-action/), [provider](/agentctl/contributing/add-provider/), [migration](/agentctl/contributing/add-migration/), or [documentation](/agentctl/contributing/documentation/) change.

## I want to remediate a container finding

Follow the [standalone container remediation tutorial](/agentctl/examples/devops/21-container-remediation/). It separates the real build/scan, two bounded agent roles, deterministic patch validation, rebuild/rescan and trusted draft-PR publisher. Use its complete download and explicit framework image mode; its own execution records distinguish offline contract checks from actual external evidence.

## I maintain a release

Follow the [release process](/agentctl/contributing/release/) for repository secrets, exact-source preparation, binary assets, image verification and publication. The runtime and source metadata retain their actual versions even though the usage guides are evergreen. Preparation and validation do not publish a release.

## Follow a complete cookbook journey

For CI work, start with [JUnit triage](/agentctl/examples/devops/02-junit-triage/) and then [explicit release gating](/agentctl/examples/devops/10-release-readiness/). For SRE work, start with [canary decisions](/agentctl/examples/devops/13-canary-evaluation/), then inspect a failed source run in [retry and repair](/agentctl/examples/devops/16-retry-repair/) before touching uncertain effects in [interrupted deployment recovery](/agentctl/examples/devops/15-interrupted-deployment/).

Each tutorial downloads as a complete source-matched package. Read the authored YAML, prepare its explicit local prerequisites, then use direct CLI commands. Acceptance-suite evidence belongs in the contributor/testing material and does not replace a first-time operator walkthrough.
