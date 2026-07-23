# agentctl documentation content matrix

| User question | Persona | Public page | Canonical source | Working example | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| What is agentctl and why use it? | evaluator | homepage, overview, why agentctl | `docs/PRODUCT.md` | `examples/acceptance/mock-tool` | site copy review, example gate | complete |
| How do I install it? | new user | installation | `docs/guides/INSTALLATION.md` | `examples/v1/hello.yaml` | source install smoke | complete |
| How do I finish a first run? | new user | getting started | `docs/guides/GETTING_STARTED.md` | `examples/v1/hello.yaml` | clean-directory run | complete |
| How do I try an agent without a key? | new user | first agent workflow | `docs/guides/FIRST_AGENT_WORKFLOW.md` | `examples/acceptance/mock-tool` | clean-directory fake-provider run | complete |
| How does workflow YAML fit together? | workflow author | workflow authoring, YAML reference | `docs/DSL.md`, `docs/reference/YAML.md` | `examples/v1/dataflow.yaml` | check and plan | complete |
| How do I run and recover locally? | operator | local operation, durable execution | `docs/OPERATIONS.md`, `docs/DURABLE_EXECUTION.md` | `examples/v1/crash-resume.yaml` | runtime and acceptance tests | complete |
| How do I use a container? | platform engineer | container | `docs/CONTAINER.md` | acceptance mock tool | locally executed container acceptance | complete |
| How do I use CI or Kubernetes? | platform engineer | CI/CD | `docs/guides/CI_CD.md`, `docs/CONTAINER.md` | checked snippets | syntax and documentation review | complete |
| How should I schedule runs? | operator | scheduled execution | `docs/OPERATIONS.md` | cron, systemd, CronJob | documentation review | complete |
| Which provider can do what? | workflow author | providers | `docs/PROVIDERS.md` | `examples/v1/*-live.yaml` | mock protocol and opt-in live gates | complete |
| How do MCP and A2A behave? | integrator | protocols | `docs/MCP.md`, `docs/A2A.md` | `examples/v1/mcp.yaml`, `a2a.yaml` | local mock servers | complete |
| What is persisted and why? | operator | stateful architecture | `docs/DURABLE_EXECUTION.md`, `docs/MEMORY.md` | crash/resume and memory examples | store/runtime tests | complete |
| How do I diagnose a failed run? | operator | troubleshooting, observability | `docs/guides/TROUBLESHOOTING.md`, `docs/OBSERVABILITY.md` | failure fixtures | exit and inspection tests | complete |
| What are the security boundaries? | security reviewer | security, threat model | `docs/SECURITY.md`, `docs/THREAT_MODEL.md` | policy denial and approval | security and policy tests | complete |
| How do I add runtime behavior? | contributor | developer guides | `docs/development/*` | focused Rust tests | cargo tests and docs gate | complete |
| What is not supported? | evaluator | limitations and compatibility | `docs/LIMITATIONS.md`, `docs/COMPATIBILITY.md` | capability failure | negative contract tests | complete |
