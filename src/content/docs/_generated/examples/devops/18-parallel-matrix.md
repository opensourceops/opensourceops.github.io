---
title: "Run bounded checks across services"
description: "Edit service inputs and inspect ordered results and failed children."
editUrl: "https://github.com/opensourceops/agentctl/edit/b91dc4dbc8300bc12809d9d667e07a5ae7465f8f/examples/devops/18-parallel-matrix/README.md"
---
> **Complete example package:** [Download all files](/agentctl/downloads/devops/18-parallel-matrix.zip). Built from source [`b91dc4dbc830`](https://github.com/opensourceops/agentctl/tree/b91dc4dbc8300bc12809d9d667e07a5ae7465f8f/examples/devops/18-parallel-matrix). It includes the helper and setup step used below; download the complete package before editing a workflow.

**For:** CI developer. **Level and evidence:** Beginner; offline, Python.

Check a small editable service set concurrently and aggregate the results in stable order.

## Get the complete example

Install the [matching agentctl binary](/agentctl/getting-started/installation/). Download this tutorial's complete package from the documentation site and extract it into an empty directory. When working from the source checkout, create the same package with:

```sh
python3 examples/devops/package.py --example 18 --output ./example-18
```

Enter the extracted directory containing `setup.py`. You need Python 3.11 or newer. Create an isolated environment and install the pinned example dependencies:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup.py
```

On Windows, use `.venv\Scripts\python.exe` in place of `.venv/bin/python`. Setup records the selected interpreters and prepares `local.workflow.yaml` with a matching explicit interpreter-basename grant. Review that generated workflow before running it. The authored [workflow.yaml](https://github.com/opensourceops/agentctl/blob/b91dc4dbc8300bc12809d9d667e07a5ae7465f8f/examples/devops/18-parallel-matrix/workflow.yaml) remains readable and editable source.

The complete package contains:

```text
18-parallel-matrix/
  README.md
  example.json
  fixtures/api.json
  fixtures/api.py
  fixtures/worker.json
  fixtures/worker.py
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

The YAML declares bounded matrix expansion and independent checks. Matrix axis names are sorted deterministically, and values retain their declared order. Here `check` precedes `service`, so the report contains syntax checks for each service followed by configuration checks for each service, regardless of completion order. A failed child remains visible and must not be hidden by a successful sibling.

[Open the complete workflow](https://github.com/opensourceops/agentctl/blob/b91dc4dbc8300bc12809d9d667e07a5ae7465f8f/examples/devops/18-parallel-matrix/workflow.yaml) to inspect its inputs, task dependencies, grants and bounds. The site embeds the same source below; editing a helper does not replace review of its host-process authority.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: devops-parallel-matrix
  description: Run a bounded two-service/two-check matrix and verify stable ordered aggregation.
spec:
  policy:
    workspaceRoot: .
    writableRoots:
      - artifacts
    processAllowlist:
      - python3
    approval: never
  runtime:
    maxConcurrency: 4
    budgets:
      maxProcessOutputBytes: 1048576
      maxArtifactBytes: 1048576
      maxTasks: 32
      maxWallTimeSeconds: 120
      maxExpansionItems: 16
  actions:
    check-service:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - service-check-item
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - service
          - check
          - index
          - maxReplicas
          - maxTimeoutSeconds
        properties:
          service:
            type: string
          check:
            type: string
          index:
            type: integer
          maxReplicas:
            type: integer
          maxTimeoutSeconds:
            type: integer
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - service
          - check
          - passed
          - index
          - source
          - sha256
          - reportText
        properties:
          service:
            type: string
          check:
            type: string
          passed:
            type: boolean
          index:
            type: integer
          source:
            type: string
          sha256:
            type: string
          reportText:
            type: string
      capabilities:
        - devops.fixture
      timeoutSeconds: 30
      stdoutLimitBytes: 65536
      stderrLimitBytes: 8192
      combinedOutputLimitBytes: 73728
    aggregate:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - aggregate-services
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - items
        properties:
          items:
            type: array
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - items
          - checks
          - passed
          - count
          - scope
          - reportText
        properties:
          items:
            type: array
          checks:
            type: array
          passed:
            type: boolean
          count:
            type: integer
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
    - id: checks
      uses: action:check-service
      with:
        service: '${{ vars.matrix.service }}'
        check: '${{ vars.matrix.check }}'
        index: '${{ vars.matrixIndex }}'
        maxReplicas: '${{ inputs.maxReplicas }}'
        maxTimeoutSeconds: '${{ inputs.maxTimeoutSeconds }}'
      matrix:
        axes:
          service:
            - api
            - worker
          check:
            - syntax
            - config
        maxItems: 16
    - id: analyze
      uses: action:aggregate
      needs:
        - checks
      with:
        items: '${{ tasks.checks.output.items }}'
    - id: report
      uses: action:write
      needs:
        - analyze
      with:
        path: artifacts/report.json
        content: '${{ tasks.analyze.output.reportText }}'
  inputs:
    maxReplicas: 3
    maxTimeoutSeconds: 30
  outputs:
    report: '${{ tasks.analyze.output }}'
    items: '${{ tasks.checks.output.items }}'
```


## Expected result

Inspect the ordered task results and aggregate report for all service/check combinations. The default fixture has two services and two checks each. Source syntax checks and configuration checks are actual local operations, not model judgments.

Selected fields from the recorded local walkthrough, after adding the third service described below:

```json
{
  "count": 6,
  "passed": true,
  "scope": "ordered aggregation of completed syntax/config checks; no service code was executed",
  "checks": [
    {
      "index": 0,
      "check": "syntax",
      "service": "api",
      "passed": true
    },
    {
      "index": 1,
      "check": "syntax",
      "service": "worker",
      "passed": true
    },
    {
      "index": 2,
      "check": "syntax",
      "service": "cache",
      "passed": true
    },
    {
      "index": 3,
      "check": "config",
      "service": "api",
      "passed": true
    },
    {
      "index": 4,
      "check": "config",
      "service": "worker",
      "passed": true
    },
    {
      "index": 5,
      "check": "config",
      "service": "cache",
      "passed": true
    }
  ]
}
```

## Use your own data

In `workflow.yaml`, append `cache` to `tasks[id=checks].matrix.axes.service`. Add `fixtures/cache.py` containing `ready = True` and `fixtures/cache.json` containing `{"replicas": 1, "timeoutSeconds": 12}`. Run `setup.py`, check and plan again before running the changed workflow. The resulting six checks are ordered `syntax/api`, `syntax/worker`, `syntax/cache`, `config/api`, `config/worker`, `config/cache`.

Make the configuration threshold fail deliberately:

```sh
agentctl run local.workflow.yaml --workspace . --db state.db --input maxTimeoutSeconds=1 --output json
agentctl inspect FAILED_RUN_ID --db state.db --output json
```

Expect exit code `4` and failed configuration children. The dependent aggregate is not newly written. If a prior successful report exists in this workspace, it belongs to that earlier run; it is not evidence that the failing invocation passed. Preserve run identifiers with reports. The matrix allows at most 16 combinations; review graph and resource limits before expanding it further.

Paths in these inputs stay inside the package's reviewed workspace. Use ordinary vars for non-secret configuration only. An input or variable does not grant authority to a new filesystem path, command or network destination.

## Failure and recovery

A missing file or failed child is an actual failure. Retry or repair should preserve compatible successful siblings. Stable output order is a contract; it does not mean tasks ran sequentially.

For a terminal successful run, reconstruct the recorded result without fresh effects:

```sh
agentctl replay RUN_ID --db state.db --output json --color never
```

For a failure, preserve the database and inspect task/effect status before choosing [resume, retry or repair](/agentctl/durable-execution/). A new run is a fresh invocation, not recovery of the old one.

## Authority and cleanup

The command uses the selected virtual environment's absolute interpreter path, while `processAllowlist` authorizes its basename. That generic Python grant trusts the reviewed helper; it does not pin one script or independently constrain its child processes. It is not an operating-system sandbox for every file access or child process made by Python. Only run the complete reviewed package on a trusted local machine or disposable runner. No production system is modified by this tutorial.

After saving needed reports and stopping this example's local service if present, remove only its disposable directory. The [optional acceptance suite](/agentctl/examples/devops/#contributor-verification) exercises additional denials, replay and failure injection; it is not required to run the published workflow.
