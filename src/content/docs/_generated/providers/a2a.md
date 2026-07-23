---
title: "A2A"
description: "Delegate bounded work to pinned A2A peers."
editUrl: "https://github.com/opensourceops/agentctl/edit/main/docs/A2A.md"
---
The client pins [A2A `1.0`](https://a2a-protocol.org/latest/specification/) and discovers an Agent Card. It selects a JSON-RPC interface advertising version `1.0`, then supports `SendMessage`, bounded `GetTask` polling, `CancelTask`, SSE task updates, terminal success/failure/cancel states, messages, structured parts, and artifacts.

Card and RPC authentication headers are environment secret references. The card URL is subject to network policy, redirects are disabled, and the selected JSON-RPC interface must have the same scheme, host, and effective port as that reviewed card URL. Cards, skills, messages, parts, and artifacts are untrusted data. An A2A delegation is a `remote_agent` effect and may require approval.

Polling is bounded; request and overall operation timeouts and cancellation are enforced. The client does not claim delivery exactly once or transparently resubmit after an ambiguous response. Mock peers cover discovery, SendMessage/GetTask, artifacts, streaming parsing, cancellation mapping, protocol mismatch, failure, and timeout at the declared maturity.
> Canonical source: [`docs/A2A.md`](https://github.com/opensourceops/agentctl/blob/main/docs/A2A.md). Verified against agentctl commit `f3181f93afac7546f01923491f77dabdf26b5ace`.
