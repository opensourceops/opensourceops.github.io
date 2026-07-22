---
title: Choose a deployment model
description: Select local, scheduled, container, CI/CD, or Kubernetes execution without changing the workflow runtime contract.
---

`agentctl` owns one bounded process and its local SQLite history. Another platform may own the trigger, runner, secret injection, state volume, artifact collection, timeout, and overlap policy.

## Local terminal

Choose local execution while authoring, reviewing plans, resolving interactive approvals, or inspecting recovery evidence. Use explicit database and workspace paths when the run will outlive a throwaway experiment.

Next: [Local operation](/agentctl/guides/local-operation/).

## Cron or systemd

Choose an operating-system scheduler for one host. Use absolute paths, an empty or controlled environment, JSON output, an overall timeout, restrictive state permissions, log rotation, and an external overlap lock.

Next: [Scheduled execution](/agentctl/operations/scheduled/).

## OCI container

Choose the generic image contract when you need a repeatable non-root process with a read-only root filesystem. Mount `/config` and `/workspace` read-only, then retain writable `/state` and `/artifacts`.

Next: [Container guide](/agentctl/guides/container/).

## CI/CD

Choose a pipeline when your platform already owns checkout, triggers, secrets, logs, and artifacts. Consume one versioned JSON envelope and stable exit code. Retain protected state when approval or recovery matters.

Next: [CI/CD integration](/agentctl/guides/ci-cd/).

## Kubernetes Job or CronJob

Choose a Job for one invocation or a CronJob for a cluster-managed schedule. Use a ConfigMap for reviewed workflow files, a Secret environment reference for credentials, persistent storage when resume or replay matters, a hardened security context, `backoffLimit: 0`, and `concurrencyPolicy: Forbid` when overlapping effects are unsafe.

Kubernetes examples in the current documentation are reviewed, not hosted execution evidence for this candidate.

## What agentctl does not provide

It is not a scheduling service, distributed lease, runner fleet, secret store, or artifact registry. Adding an external scheduler does not make SQLite a distributed database or policy allowlists an operating-system sandbox.
