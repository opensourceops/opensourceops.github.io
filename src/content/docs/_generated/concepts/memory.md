---
title: "State and memory"
description: "Separate runtime state, working memory, long-term memory, and prompt cache."
editUrl: "https://github.com/opensourceops/agentctl/edit/main/docs/memory.md"
---
Four mechanisms remain intentionally separate:

- Run state is authoritative lifecycle data: inputs, task states, attempts, outputs, cancellations, effects, approvals, and checkpoints.
- Working memory is a JSON object owned by one run. Writes are explicit keyed internal-state effects and the updated object commits with the task transition and checkpoint. Sequential scheduling is its merge rule.
- Long-term memory is namespaced SQLite data across runs with optional expiry. Reads/writes are explicit actions; `memory get/put` and `gc` provide administration. Replay never rolls it back or treats it as history.
- Provider prompt cache is an optional performance optimization. Cache keys/options and usage counts are provider metadata, never correctness or memory.

Long-term retrieval is exact namespace/key lookup in this release. Vector search and automatic promotion are not implemented. A workflow promotes a value explicitly by reading long-term memory and then writing working memory. Retention is applied by expiration/GC, not by replay.
> Canonical source: [`docs/memory.md`](https://github.com/opensourceops/agentctl/blob/main/docs/memory.md). Verified against agentctl commit `f3181f93afac7546f01923491f77dabdf26b5ace`.
