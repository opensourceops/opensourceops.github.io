---
title: "Recover an interrupted deployment"
description: "Inspect uncertain effects before reconciliation and resume."
editUrl: "https://github.com/opensourceops/agentctl/edit/30167c8330b1a3fb0bb89c2426d6310e1efd6aa4/examples/devops/15-interrupted-deployment/README.md"
---
> **Candidate example package:** [Download all files](/agentctl/downloads/devops/15-interrupted-deployment.zip). Built from source [`30167c8330b1`](https://github.com/opensourceops/agentctl/tree/30167c8330b1a3fb0bb89c2426d6310e1efd6aa4/examples/devops/15-interrupted-deployment). It includes the helper and setup step used below; download the complete package before editing a workflow.

**For:** SRE. **Level and evidence:** Advanced; local recovery contract demonstration. Fault injection is a separate test aid.

Inspect durable evidence after execution stops and resume confirmed work without duplicating an uncertain mutation.

## Get the complete example

Install the [matching candidate binary](/agentctl/getting-started/installation/). Download this tutorial's complete package from the documentation site and extract it into an empty directory. When working from the source checkout, create the same package with:

```sh
python3 examples/devops/package.py --example 15 --output ./example-15
```

Enter the extracted directory containing `setup.py`. You need Python 3.11 or newer. Create an isolated environment and install the pinned example dependencies:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup.py
```

On Windows, use `.venv\Scripts\python.exe` in place of `.venv/bin/python`. Setup records the selected interpreters and prepares `local.workflow.yaml` with a matching explicit interpreter-basename grant. Review that generated workflow before running it. The authored [workflow.yaml](https://github.com/opensourceops/agentctl/blob/30167c8330b1a3fb0bb89c2426d6310e1efd6aa4/examples/devops/15-interrupted-deployment/workflow.yaml) remains readable and editable source.

The complete package contains:

```text
15-interrupted-deployment/
  README.md
  example.json
  fault.workflow.yaml
  fixtures/desired-service.json
  format_operations.py
  helper.py
  local_service.py
  operations.py
  requirements.txt
  service_operations.py
  setup.py
  workflow.yaml
  yaml_io.py
```

Setup creates local configuration and outputs separately. Keep `state.db` and `artifacts/` when investigating a run.

## Run and inspect

```sh
agentctl check local.workflow.yaml --workspace .
agentctl plan local.workflow.yaml --workspace .
agentctl run local.workflow.yaml --workspace . --db state.db --output json --color never
```

Copy `runId` from the JSON result, then inspect it:

```sh
agentctl inspect RUN_ID --db state.db --output json --color never
```

## Follow the YAML

The local mutation records its effect before execution. After interruption, inspect the run and effect ledger. A confirmed applied mutation can be reused. An uncertain non-idempotent effect requires evidence about the external state before narrowly recording reconciliation.

[Open the complete workflow](https://github.com/opensourceops/agentctl/blob/30167c8330b1a3fb0bb89c2426d6310e1efd6aa4/examples/devops/15-interrupted-deployment/workflow.yaml) to inspect its inputs, task dependencies, grants and bounds. The site embeds the same source below; editing a helper does not replace review of its host-process authority.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: devops-interrupted-deployment
  description: Interrupt a run after a non-idempotent local mutation and prove resume does not repeat its confirmed effect.
spec:
  policy:
    workspaceRoot: .
    writableRoots:
      - artifacts
    processAllowlist:
      - python3
    approval: never
  runtime:
    maxConcurrency: 1
    budgets:
      maxProcessOutputBytes: 1048576
      maxArtifactBytes: 1048576
      maxTasks: 32
      maxWallTimeSeconds: 120
  actions:
    deploy-service:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - service-deploy
      idempotency: at_most_once
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - desiredPath
        properties:
          desiredPath:
            type: string
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - mutation
          - version
          - desiredText
          - desiredSha256
          - scope
          - reportText
        properties:
          mutation:
            type: integer
          version:
            type: string
          desiredText:
            type: string
          desiredSha256:
            type: string
          scope:
            type: string
          reportText:
            type: string
      capabilities:
        - devops.fixture
      timeoutSeconds: 30
      stdoutLimitBytes: 65536
      stderrLimitBytes: 8192
      combinedOutputLimitBytes: 73728
    check-service:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - service-check
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - expectedText
          - requireReady
        properties:
          expectedText:
            type: string
          requireReady:
            type: boolean
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - verified
          - version
          - healthy
          - mutation
          - sha256
          - dependencyChecked
          - reason
          - scope
          - reportText
        properties:
          verified:
            type: boolean
          version:
            type: string
          healthy:
            type: boolean
          mutation:
            type: integer
          sha256:
            type: string
          dependencyChecked:
            type: boolean
          reason:
            type: string
          scope:
            type: string
          reportText:
            type: string
      capabilities:
        - devops.fixture
      timeoutSeconds: 30
      stdoutLimitBytes: 65536
      stderrLimitBytes: 8192
      combinedOutputLimitBytes: 73728
    write:
      kind: builtin.write
  tasks:
    - id: deploy
      uses: action:deploy-service
      with:
        desiredPath: '${{ inputs.desiredPath }}'
    - id: analyze
      uses: action:check-service
      needs:
        - deploy
      with:
        expectedText: '${{ tasks.deploy.output.desiredText }}'
        requireReady: false
    - id: report
      uses: action:write
      needs:
        - analyze
      with:
        path: artifacts/report.json
        content: '${{ tasks.analyze.output.reportText }}'
  inputs:
    desiredPath: fixtures/desired-service.json
  outputs:
    report: '${{ tasks.analyze.output }}'
```


## Stop the explicit fault fixture

The primary workflow above completes normally without a model. To exercise interruption, use a second fresh package and its separately authored `local.fault.workflow.yaml`. Its fake provider waits 30 seconds after the confirmed local deployment. Its request and token ceilings reserve capacity for the interrupted attempt and one continuation; it makes no paid requests.

The following advanced test aid requires a POSIX shell. Start this exact fixture in the background and keep its process identifier:

```sh
agentctl check local.fault.workflow.yaml --workspace .
agentctl plan local.fault.workflow.yaml --workspace .
agentctl run local.fault.workflow.yaml --workspace . --db state.db --output json > fault.stdout 2> fault.stderr &
FAULT_PID=$!
```

The CLI does not print a run identifier while this fixture waits. For this disposable test only, read the newest identifier from the local database without changing it:

```sh
.venv/bin/python -c "import sqlite3; from pathlib import Path; db=sqlite3.connect(Path('state.db').resolve().as_uri()+'?mode=ro',uri=True); print(db.execute('SELECT run_id FROM runs ORDER BY created_at DESC LIMIT 1').fetchone()[0]); db.close()"
agentctl inspect RUN_ID --db state.db --output json
```

Inspect until task `deploy` is `succeeded` and the effect with operation `fake` is `started`. Do not interrupt before that evidence exists. While the fake delay is still active, stop only the process you just started:

```sh
kill -KILL "$FAULT_PID"
```

If the fixture already completed, retain its result and use another fresh package for the interruption exercise. The SQL query is an explicit test aid for this pinned candidate's SQLite schema, not an instruction to edit engine state or an application integration API.

## Inspect before resuming

Use the stopped run's identifier to inspect each relevant effect and try conservative recovery:

```sh
agentctl effects --db state.db list RUN_ID --output json
agentctl effects --db state.db inspect EFFECT_ID --output json
agentctl resume RUN_ID --db state.db --workspace . --output json
```

If resume reports uncertainty, preserve the failure and inspect the operation type. For this tutorial's deliberately interrupted **in-process fake delay only**, there is no remote request or mutation to recover. After verifying that exact boundary and the confirmed local deployment, record the narrow reconciliation:

```sh
agentctl effects --db state.db inspect EFFECT_ID --output json > interrupted-effect.json
agentctl effects --db state.db reconcile EFFECT_ID --status not-applied --actor local-reviewer --reason "Reviewed the interrupted in-process fake delay; it has no external effect" --evidence-file interrupted-effect.json --approved
agentctl resume RUN_ID --db state.db --workspace . --output json
```

If the inspected source is already terminal `failed`, use a reviewed terminal retry after reconciliation:

```sh
agentctl retry local.fault.workflow.yaml RUN_ID --failed --plan --db state.db --workspace .
agentctl retry local.fault.workflow.yaml RUN_ID --failed --db state.db --workspace . --output json
```

The example's fake-delay explanation does not apply to a real provider or deployment operation. An effect inspection by itself cannot prove that a remote service did nothing. For a real mutation, collect provider-side evidence and follow the [effect reconciliation guide](https://github.com/opensourceops/agentctl/blob/30167c8330b1a3fb0bb89c2426d6310e1efd6aa4/docs/guides/EFFECT_RECONCILIATION.md).

## Expected result

Inspect `artifacts/service.json`, `artifacts/report.json` and `artifacts/mutations.txt` alongside the persisted effect status. The final report must verify the actual deployed data and the mutation counter must remain `1`. The demonstration should show one confirmed local mutation across recovery. This is not an exactly-once guarantee for a remote system.

Selected fields from the recorded local walkthrough, after the interrupted fake fixture was reconciled and resumed:

```json
{
  "verified": true,
  "healthy": true,
  "mutation": 1,
  "scope": "actual local configuration validation; this check does not claim HTTP or external deployment health"
}
```

## Use your own data

Use the normal workflow to learn the state transition first. Use the documented fault-injection path only in this disposable package. Preserve the SQLite database and workspace when investigating a stopped run; deleting state destroys the evidence needed for safe recovery.

Paths in these inputs stay inside the package's reviewed workspace. Use ordinary vars for non-secret configuration only. An input or variable does not grant authority to a new filesystem path, command or network destination.

## Failure and recovery

Do not retry an uncertain mutation simply to get a green result. A fixture-only interrupted fake-provider call can be reconciled as not applied only after verifying that it has no external effect. Real remote mutations need their own request IDs and provider-side evidence.

For a terminal successful run, reconstruct the recorded result without fresh effects:

```sh
agentctl replay RUN_ID --db state.db --output json --color never
```

For a failure, preserve the database and inspect task/effect status before choosing [resume, retry or repair](/agentctl/durable-execution/). A new run is a fresh invocation, not recovery of the old one.

## Authority and cleanup

The command uses the selected virtual environment's absolute interpreter path, while `processAllowlist` authorizes its basename. That generic Python grant trusts the reviewed helper; it does not pin one script or independently constrain its child processes. It is not an operating-system sandbox for every file access or child process made by Python. Only run the complete reviewed package on a trusted local machine or disposable runner. No production system is modified by this tutorial.

After saving needed reports and stopping this example's local service if present, remove only its disposable directory. The [optional acceptance suite](/agentctl/examples/devops/#contributor-verification) exercises additional denials, replay and failure injection; it is not required to run the published workflow.
