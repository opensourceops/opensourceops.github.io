---
title: "Evaluate a canary"
description: "Route healthy, unhealthy, and insufficient-data metrics explicitly."
editUrl: "https://github.com/opensourceops/agentctl/edit/42922f9479f9b9cda360c36cf9b113ae4ce50f9a/examples/devops/13-canary-evaluation/README.md"
---
> **Complete example package:** [Download all files](/agentctl/downloads/devops/13-canary-evaluation.zip). Built from source [`42922f9479f9`](https://github.com/opensourceops/agentctl/tree/42922f9479f9b9cda360c36cf9b113ae4ce50f9a/examples/devops/13-canary-evaluation). It includes the helper and setup step used below; download the complete package before editing a workflow.

**For:** SRE. **Level and evidence:** Beginner; offline local decision, no monitoring-service access.

Route a candidate to promote, rollback or hold using supplied request/error counts and minimum evidence thresholds.

## Get the complete example

Install the [matching agentctl binary](/agentctl/getting-started/installation/). Download this tutorial's complete package from the documentation site and extract it into an empty directory. When working from the source checkout, create the same package with:

```sh
python3 examples/devops/package.py --example 13 --output ./example-13
```

Enter the extracted directory containing `setup.py`. You need Python 3.11 or newer. Create an isolated environment and install the pinned example dependencies:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup.py
```

On Windows, use `.venv\Scripts\python.exe` in place of `.venv/bin/python`. Setup records the selected interpreters and prepares `local.workflow.yaml` with a matching explicit interpreter-basename grant. Review that generated workflow before running it. The authored [workflow.yaml](https://github.com/opensourceops/agentctl/blob/42922f9479f9b9cda360c36cf9b113ae4ce50f9a/examples/devops/13-canary-evaluation/workflow.yaml) remains readable and editable source.

The complete package contains:

```text
13-canary-evaluation/
  README.md
  example.json
  fixtures/metrics.json
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

The workflow validates integer counts, aggregates requests and errors, checks minimum sample and request counts, then uses a typed router. Insufficient evidence selects hold; it must not promote merely because there were zero observed errors.

[Open the complete workflow](https://github.com/opensourceops/agentctl/blob/42922f9479f9b9cda360c36cf9b113ae4ce50f9a/examples/devops/13-canary-evaluation/workflow.yaml) to inspect its inputs, task dependencies, grants and bounds. The site embeds the same source below; editing a helper does not replace review of its host-process authority.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: devops-canary-evaluation
  description: Aggregate canary metrics and use typed routing to choose an isolated promotion or rollback artifact.
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
    evaluate-canary:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - canary-evaluate
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - metricsPath
          - errorLimit
          - minRequests
          - minSamples
        properties:
          metricsPath:
            type: string
          errorLimit:
            type: number
          minRequests:
            type: integer
          minSamples:
            type: integer
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - requests
          - errors
          - errorRatio
          - errorLimit
          - sampleCount
          - minRequests
          - minSamples
          - sufficientData
          - route
          - reportText
        properties:
          requests:
            type: integer
          errors:
            type: integer
          errorRatio:
            type:
              - number
              - 'null'
          errorLimit:
            type: number
          sampleCount:
            type: integer
          minRequests:
            type: integer
          minSamples:
            type: integer
          sufficientData:
            type: boolean
          route:
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
    - id: analyze
      uses: action:evaluate-canary
      with:
        metricsPath: '${{ inputs.metricsPath }}'
        errorLimit: '${{ inputs.errorLimit }}'
        minRequests: '${{ inputs.minRequests }}'
        minSamples: '${{ inputs.minSamples }}'
      outputSchema:
        type: object
        required:
          - route
          - sufficientData
        properties:
          route:
            type: string
            enum:
              - promote
              - rollback
              - hold
          sufficientData:
            type: boolean
    - id: route
      uses: router
      needs:
        - analyze
      route:
        select: '${{ tasks.analyze.output.route }}'
        cases:
          - equals: promote
            tasks:
              - promote
          - equals: rollback
            tasks:
              - rollback
        default:
          - hold
    - id: promote
      uses: action:write
      needs:
        - route
      with:
        path: artifacts/promotion.json
        content: |
          {"scope":"local fixture","promoted":true}
    - id: rollback
      uses: action:write
      needs:
        - route
      with:
        path: artifacts/rollback.json
        content: |
          {"scope":"local fixture","rolledBack":true}
    - id: hold
      uses: action:write
      needs:
        - route
      with:
        path: artifacts/hold.json
        content: |
          {"scope":"local decision","reason":"insufficient-data"}
    - id: report
      uses: action:write
      needs:
        - analyze
      with:
        path: artifacts/report.json
        content: '${{ tasks.analyze.output.reportText }}'
  inputs:
    metricsPath: fixtures/metrics.json
    errorLimit: 0.01
    minRequests: 100
    minSamples: 2
  outputs:
    report: '${{ tasks.analyze.output }}'
```


## Expected result

The report exposes totals, ratio, thresholds, sample count, `sufficientData` and route. Healthy data selects promotion, unhealthy data selects rollback, and insufficient data holds. In a fresh package, only the selected local branch artifact should exist. Use a fresh package for each branch demonstration; artifacts from older invocations are not evidence of the current decision.

Selected fields from the supplied fixture's `artifacts/report.json`:

```json
{
  "requests": 1000,
  "errors": 3,
  "errorRatio": 0.003,
  "sufficientData": true,
  "route": "promote"
}
```

## Use your own data

Use `--input metricsPath=fixtures/my-metrics.json --input errorLimit=0.01 --input minRequests=100 --input minSamples=2`. Set thresholds from your service objective and sampling window. These counts are supplied observations, not a live monitoring query.

Paths in these inputs stay inside the package's reviewed workspace. Use ordinary vars for non-secret configuration only. An input or variable does not grant authority to a new filesystem path, command or network destination.

## Failure and recovery

Negative counts, errors greater than requests, boolean counts, out-of-range ratios or nonpositive evidence thresholds are invalid. Test both a high-error sample and a small sample before connecting this decision to any real deployment.

For a terminal successful run, reconstruct the recorded result without fresh effects:

```sh
agentctl replay RUN_ID --db state.db --output json --color never
```

For a failure, preserve the database and inspect task/effect status before choosing [resume, retry or repair](/agentctl/durable-execution/). A new run is a fresh invocation, not recovery of the old one.

## Authority and cleanup

The command uses the selected virtual environment's absolute interpreter path, while `processAllowlist` authorizes its basename. That generic Python grant trusts the reviewed helper; it does not pin one script or independently constrain its child processes. It is not an operating-system sandbox for every file access or child process made by Python. Only run the complete reviewed package on a trusted local machine or disposable runner. No production system is modified by this tutorial.

After saving needed reports and stopping this example's local service if present, remove only its disposable directory. The [optional acceptance suite](/agentctl/examples/devops/#contributor-verification) exercises additional denials, replay and failure injection; it is not required to run the published workflow.
