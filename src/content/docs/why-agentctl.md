---
title: Why agentctl
description: See where deterministic agent workflows fit beside scripts, chat agents, workflow engines, configuration management, and CI/CD.
---

The useful boundary is not “agents instead of automation.” It is deterministic automation that can delegate a bounded judgment task without giving the model control of authority, graph structure, persistence, or recovery.

## The problem with ordinary agent scripts

A direct model call is easy to start. It becomes harder to review when prompts imply authority, tool schemas drift, retry can duplicate an effect, an interrupted process loses progress, or a pipeline needs one stable result. Adding ad hoc state and approval logic can turn a small script into a hidden workflow engine.

`agentctl` makes those concerns explicit in one strict document and one durable runtime:

- declaration-ordered graph compilation;
- typed inputs, outputs, templates, actions, agents, and tools;
- policy checks outside model prompts;
- effect identity and conservative uncertainty;
- durable approvals, checkpoints, audit events, and trace correlation;
- resume, recorded replay, and explicit fork semantics;
- native provider adapters behind one neutral core.

## Related approaches

| Approach | Choose it when | Add agentctl when |
| --- | --- | --- |
| Shell script calling a model | The task is small, disposable, and has no recovery or policy need. | The call becomes one step in a reviewed graph with effects and durable evidence. |
| Chat-agent framework | Interaction and dynamic conversation are the product. | A reviewed workflow, not a conversation, must own control flow. |
| General workflow engine | You need broad scheduling, distributed workers, or many integration types. | A task needs bounded model or tool semantics and a local correctness record. |
| Ansible | You need configuration management and convergent idempotent resources. | You need a bounded reasoning step, not a replacement for configuration management. |
| CI/CD pipeline | You need runners, triggers, secret injection, and artifact retention. | One pipeline step needs strict agent workflow execution and recovery semantics. |

## Reasons not to choose it

Do not choose the current release when you require a 1.0 CLI or long-term
support contract, distributed execution, a hosted scheduler, a visual builder,
an operating-system-enforced in-process sandbox, or live support evidence for
every provider. Read [Limitations](/agentctl/reference/limitations/) before
adopting workflow API `agentctl.dev/v1`.
