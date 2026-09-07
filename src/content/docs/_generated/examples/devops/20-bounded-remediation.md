---
title: "Run a bounded remediation loop"
description: "Validate actual repair artifacts under explicit iteration and resource limits."
editUrl: "https://github.com/opensourceops/agentctl/edit/c223d012727a75de62112923d4da8befbe2068f2/examples/devops/20-bounded-remediation/README.md"
---
> **Complete example package:** [Download all files](/agentctl/downloads/devops/20-bounded-remediation.zip). Built from source [`c223d012727a`](https://github.com/opensourceops/agentctl/tree/c223d012727a75de62112923d4da8befbe2068f2/examples/devops/20-bounded-remediation). It includes the helper and setup step used below; download the complete package before editing a workflow.

**For:** SRE. **Level and evidence:** Intermediate for the deterministic offline path; advanced for the separate fake-agent or paid OpenAI proposal variants.

Repair an input-derived local configuration defect within a fixed loop and resource ceiling, then validate the actual artifact.

## Get the complete example

Install the [matching agentctl binary](/agentctl/getting-started/installation/). Download this tutorial's complete package from the documentation site and extract it into an empty directory. When working from the source checkout, create the same package with:

```sh
python3 examples/devops/package.py --example 20 --output ./example-20
```

Enter the extracted directory containing `setup.py`. You need Python 3.11 or newer. Create an isolated environment and install the pinned example dependencies:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup.py
```

On Windows, use `.venv\Scripts\python.exe` in place of `.venv/bin/python`. Setup records the selected interpreters and prepares `local.workflow.yaml` with a matching explicit interpreter-basename grant. Review that generated workflow before running it. The authored [workflow.yaml](https://github.com/opensourceops/agentctl/blob/c223d012727a75de62112923d4da8befbe2068f2/examples/devops/20-bounded-remediation/workflow.yaml) remains readable and editable source.

The complete package contains:

```text
20-bounded-remediation/
  README.md
  contract.workflow.yaml
  example.json
  fixtures/configuration.json
  format_operations.py
  helper.py
  instructions/remediator.md
  local_service.py
  openai.workflow.yaml
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

The primary YAML declares `prepare` → `repair` → `analyze` → `report`. `repair` is a deterministic action loop with at most three iterations; it reads the previous artifact, performs one bounded timeout reduction and computes completion from the actual resulting configuration. `analyze` rereads the final artifact and checks the threshold, preserved fields and digest before reporting success.

[Open the complete workflow](https://github.com/opensourceops/agentctl/blob/c223d012727a75de62112923d4da8befbe2068f2/examples/devops/20-bounded-remediation/workflow.yaml) to inspect its inputs, task dependencies, grants and bounds. The site embeds the same source below; editing a helper does not replace review of its host-process authority.


```yaml
# Repair completion uses actual artifact validation; optional model done only ends proposal attempts.
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: devops-bounded-remediation
  description: Run a bounded model/tool remediation loop, validate the resulting local configuration, and retain token/cost/audit evidence.
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
      maxLoopIterations: 6
  actions:
    prepare:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - prepare-remediation
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        required:
          - configurationPath
          - maxTimeout
          - maxReduction
        additionalProperties: false
        properties:
          configurationPath:
            type: string
          maxTimeout:
            type: integer
          maxReduction:
            type: integer
      outputSchema:
        type: object
        required:
          - configurationPath
          - configuration
          - sourceSha256
          - current
          - expectedTimeout
          - maxTimeout
          - maxReduction
          - iteration
          - targetTimeout
          - reportText
        additionalProperties: false
        properties:
          configurationPath:
            type: string
          configuration:
            type: object
          sourceSha256:
            type: string
          current:
            type: object
          expectedTimeout:
            type: integer
          maxTimeout:
            type: integer
          maxReduction:
            type: integer
          iteration:
            type: integer
          targetTimeout:
            type: integer
          reportText:
            type: string
      capabilities:
        - devops.fixture
      timeoutSeconds: 30
      stdoutLimitBytes: 65536
      stderrLimitBytes: 8192
      combinedOutputLimitBytes: 73728
    repair-step:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - remediation-step
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        required:
          - configurationPath
          - maxTimeout
          - maxReduction
          - iteration
          - previous
        additionalProperties: false
        properties:
          configurationPath:
            type: string
          maxTimeout:
            type: integer
          maxReduction:
            type: integer
          iteration:
            type: integer
          previous:
            type: object
      outputSchema:
        type: object
        required:
          - done
          - timeoutSeconds
          - iteration
          - artifactSha256
          - reportText
        additionalProperties: false
        properties:
          done:
            type: boolean
          timeoutSeconds:
            type: integer
          iteration:
            type: integer
          artifactSha256:
            type: string
          reportText:
            type: string
      capabilities:
        - devops.fixture
      timeoutSeconds: 30
      stdoutLimitBytes: 65536
      stderrLimitBytes: 8192
      combinedOutputLimitBytes: 73728
    verify:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - verify-remediation
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        required:
          - configurationPath
          - maxTimeout
        additionalProperties: false
        properties:
          configurationPath:
            type: string
          maxTimeout:
            type: integer
      outputSchema:
        type: object
        required:
          - validated
          - configuration
          - maxTimeout
          - artifactSha256
          - completionEvidence
          - reportText
        additionalProperties: false
        properties:
          validated:
            type: boolean
          configuration:
            type: object
          maxTimeout:
            type: integer
          artifactSha256:
            type: string
          completionEvidence:
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
    - id: prepare
      uses: action:prepare
      with:
        configurationPath: '${{ inputs.configurationPath }}'
        maxTimeout: '${{ inputs.maxTimeout }}'
        maxReduction: '${{ inputs.maxReduction }}'
    - id: repair
      uses: action:repair-step
      needs:
        - prepare
      with:
        configurationPath: '${{ inputs.configurationPath }}'
        maxTimeout: '${{ inputs.maxTimeout }}'
        maxReduction: '${{ inputs.maxReduction }}'
        iteration: '${{ vars.loopIndex }}'
        previous: '${{ vars.loopPrevious }}'
      loop:
        maxIterations: 3
        while: '${{ vars.loopPrevious.done == false }}'
        initial:
          done: false
    - id: analyze
      uses: action:verify
      needs:
        - repair
      with:
        configurationPath: '${{ inputs.configurationPath }}'
        maxTimeout: '${{ inputs.maxTimeout }}'
    - id: report
      uses: action:write
      needs:
        - analyze
      with:
        path: artifacts/report.json
        content: '${{ tasks.analyze.output.reportText }}'
  inputs:
    configurationPath: fixtures/configuration.json
    maxTimeout: 30
    maxReduction: 120
  outputs:
    report: '${{ tasks.analyze.output }}'
```


## Optional bounded proposal stage

`contract.workflow.yaml` and `openai.workflow.yaml` add a separate proposal loop, also capped at three attempts. The agent stages the configured target as strict decimal bytes. `validate-target` checks those bytes, the proposal, the unchanged source and configured maximum before allowing the same deterministic repair loop described above.

A model's `done` value only ends its proposal attempts. It cannot establish that the configuration was repaired, bypass `validate-target`, or replace final artifact verification. These variants exercise the agent/tool contract; the primary input-driven repair works without a model.

## Expected result

Inspect the original configuration, proposed change, final artifact, iteration count and usage records. Successful termination requires the actual configuration to meet the declared rule. Invalid proposals and bounded nonconvergence remain failures.

Actual `remediation.json` from the recorded provider-free walkthrough:

```json
{
  "retries": 3,
  "security": {
    "allowPrivilegeEscalation": false
  },
  "service": "worker",
  "timeoutSeconds": 30
}
```

## Use your own data

Pass `--input configurationPath=fixtures/my-configuration.json --input maxTimeout=30 --input maxReduction=120` for a new source. The supplied timeout of 300 follows 180 → 60 → 30. Changing the maximum to 45 produces 180 → 60 → 45. Each step reduces an excessive timeout by at most the selected reduction until it meets the maximum; already valid values remain unchanged. `artifacts/remediation.json` must preserve unrelated fields. Test several source values and thresholds, including a defect too large to converge within the loop ceiling. Keep tool, request, token, cost and iteration ceilings explicit. The primary path requires no provider. Use the opt-in live workflow only with a shared paid allowance.

Paths in these inputs stay inside the package's reviewed workspace. Use ordinary vars for non-secret configuration only. An input or variable does not grant authority to a new filesystem path, command or network destination.

## Failure and recovery

Out-of-bounds or malformed proposals must leave no accepted repair artifact. For the supplied timeout of 300, `--input maxReduction=20` cannot reach 30 in three iterations and must fail. In an agent variant, repeated ineffective proposals must also exhaust its separate bounded attempt loop. Synthetic fake-provider prices exercise accounting; they are not a real bill.

For a terminal successful run, reconstruct the recorded result without fresh effects:

```sh
agentctl replay RUN_ID --db state.db --output json --color never
```

For a failure, preserve the database and inspect task/effect status before choosing [resume, retry or repair](/agentctl/durable-execution/). A new run is a fresh invocation, not recovery of the old one.

## Authority and cleanup

The command uses the selected virtual environment's absolute interpreter path, while `processAllowlist` authorizes its basename. That generic Python grant trusts the reviewed helper; it does not pin one script or independently constrain its child processes. It is not an operating-system sandbox for every file access or child process made by Python. Only run the complete reviewed package on a trusted local machine or disposable runner. No production system is modified by this tutorial.

After saving needed reports and stopping this example's local service if present, remove only its disposable directory. The [optional acceptance suite](/agentctl/examples/devops/#contributor-verification) exercises additional denials, replay and failure injection; it is not required to run the published workflow.
