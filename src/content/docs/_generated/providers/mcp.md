---
title: "MCP"
description: "Use pinned MCP Streamable HTTP tools under explicit policy."
editUrl: "https://github.com/opensourceops/agentctl/edit/main/docs/MCP.md"
---
The client pins the stable MCP protocol version `2025-11-25` from the [official specification](https://modelcontextprotocol.io/specification/2025-11-25). It uses Streamable HTTP JSON-RPC and implements initialization/version negotiation, initialized notification, session IDs, protocol headers, tool listing, input/output schemas, tool calls, structured content, error mapping, SSE response parsing, timeout, best-effort cancellation notification, and explicit session-expiry failure.

Authentication headers are environment secret references. The endpoint must pass network policy. Redirects are disabled and an `Origin` header is sent. Remote descriptions, schemas, content, and annotations are untrusted; annotations are exposed only as metadata and never authorize an effect.

The client initializes lazily and does not automatically reconnect after session expiry because repeating a remote operation could be unsafe. The caller must reconcile and resume or fork. Streaming transport is parsed, but tool results are delivered to the runtime only when complete. Deterministic local mock-server tests cover negotiation, sessions, listing/call, structured results, version mismatch, and timeout.
> Canonical source: [`docs/MCP.md`](https://github.com/opensourceops/agentctl/blob/main/docs/MCP.md). Verified against agentctl commit `3fcd4bc7394975d923773141eb139324494d4f9a`.
