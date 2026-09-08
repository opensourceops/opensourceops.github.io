---
title: Cookbook
description: Choose a complete workflow for CI, platform engineering, SRE, release, or security work.
---

Start with a concrete problem. Every tutorial has a complete example package, readable workflow YAML, direct CLI commands, editable inputs, and an explanation of what its checks establish. The acceptance suite is a separate contributor tool.

The `v1` in `agentctl.dev/v1` identifies the workflow document API. Install the [matching agentctl binary](/agentctl/getting-started/installation/) before downloading a package.

## CI developers

| Problem | Tutorial | Prerequisites beyond agentctl |
| --- | --- | --- |
| A build failed and the log is long | [Diagnose a failed CI build](/agentctl/examples/devops/01-ci-diagnosis/) | Python; optional paid OpenAI analysis |
| Test failures need classification | [Triage JUnit results](/agentctl/examples/devops/02-junit-triage/) | Python |
| A workflow has excessive permissions | [Review a pipeline](/agentctl/examples/devops/03-pipeline-review/) | Python, Git, declared YAML validator |
| A vendored fix needs evidence | [Validate a patch](/agentctl/examples/devops/07-dependency-update/) | Python, Git |
| Several services need bounded checks | [Run a service matrix](/agentctl/examples/devops/18-parallel-matrix/) | Python |

## Platform and DevOps engineers

| Problem | Tutorial | Prerequisites beyond agentctl |
| --- | --- | --- |
| A container runs as root | [Review a Dockerfile](/agentctl/examples/devops/04-dockerfile-review/) | Python, Git; optional Docker or Podman |
| A manifest needs local validation | [Validate Kubernetes YAML](/agentctl/examples/devops/05-kubernetes-review/) | Python, bundled pinned schema and JSON Schema validator |
| A plan needs human review | [Review a Terraform plan](/agentctl/examples/devops/06-terraform-plan/) | Python; no cloud account |
| Effective settings differ from intent | [Explain configuration drift](/agentctl/examples/devops/11-configuration-drift/) | Python |
| A local change needs approval and a probe | [Approve a disposable deployment](/agentctl/examples/devops/14-local-deployment/) | Python, loopback service |
| An automated proposal needs review | [Connect bounded roles](/agentctl/examples/devops/19-role-subworkflow/) | Python; optional paid OpenAI analysis |

## SREs

| Problem | Tutorial | Prerequisites beyond agentctl |
| --- | --- | --- |
| Logs disagree about event order | [Build an incident timeline](/agentctl/examples/devops/12-incident-timeline/) | Python; optional paid OpenAI analysis |
| A canary needs a measurable decision | [Evaluate a canary](/agentctl/examples/devops/13-canary-evaluation/) | Python |
| Execution stopped after a mutation | [Recover interrupted work](/agentctl/examples/devops/15-interrupted-deployment/) | Python; explicit fault fixture |
| A terminal failure needs a new attempt | [Retry or repair](/agentctl/examples/devops/16-retry-repair/) | Python |
| A rollout needs a best-effort inverse | [Compensate a failed rollout](/agentctl/examples/devops/17-compensated-rollout/) | Python |
| A repair must converge within a ceiling | [Bound a remediation loop](/agentctl/examples/devops/20-bounded-remediation/) | Python; optional paid OpenAI analysis |

## Release and security practitioners

| Problem | Tutorial | Prerequisites beyond agentctl |
| --- | --- | --- |
| A direct dependency finding needs a validated source fix | [Remediate a container vulnerability](/agentctl/examples/devops/21-container-remediation/) | Docker/Podman, Trivy, bounded provider access; separate demo publisher token |
| A vulnerability may have an exception | [Triage an SBOM](/agentctl/examples/devops/08-sbom-triage/) | Python |
| Release notes need source evidence | [Generate release notes](/agentctl/examples/devops/09-release-notes/) | Python, Git |
| Reports must become a release gate | [Enforce release readiness](/agentctl/examples/devops/10-release-readiness/) | Python |

## Choose the appropriate evidence level

**Offline practical workflows** parse your supplied local logs, manifests, reports, or repositories. **Contract demonstrations** use disposable state to teach approvals, interruptions, role handoffs, or compensation; their tutorials explain the simulated boundary. **Opt-in live integrations** make separately budgeted provider requests. None of these examples deploys production infrastructure.

A successful analysis can intentionally produce a `no-go` report. Use the explicit gate path in the SBOM and release-readiness tutorials when a CI job must exit nonzero and prevent downstream changes.

The [cookbook package guide](/agentctl/examples/devops/) explains installation, process authority, and optional verification. Existing focused guides remain available: [repository audit](/agentctl/examples/repository-audit/), [release readiness](/agentctl/examples/release-readiness/), [scheduled review](/agentctl/examples/scheduled-review/), [CI quality gate](/agentctl/examples/ci-quality-gate/), [approval](/agentctl/examples/approval-gated/), [recorded replay](/agentctl/examples/recorded-replay/), and [provider portability](/agentctl/examples/provider-portability/).
