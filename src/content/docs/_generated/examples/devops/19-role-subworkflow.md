---
title: "Review a proposed change with bounded roles"
description: "Connect planner, reviewer, and executor through typed handoffs."
editUrl: "https://github.com/opensourceops/agentctl/edit/c223d012727a75de62112923d4da8befbe2068f2/examples/devops/19-role-subworkflow/README.md"
---
> **Complete example package:** [Download all files](/agentctl/downloads/devops/19-role-subworkflow.zip). Built from source [`c223d012727a`](https://github.com/opensourceops/agentctl/tree/c223d012727a75de62112923d4da8befbe2068f2/examples/devops/19-role-subworkflow). It includes the helper and setup step used below; download the complete package before editing a workflow.

**For:** Platform engineer. **Level and evidence:** Advanced; deterministic offline change review with typed handoffs. Separate fake-agent and paid OpenAI variants.

Connect planner, reviewer and executor through typed handoffs for a substantive, bounded local change.

## Get the complete example

Install the [matching agentctl binary](/agentctl/getting-started/installation/). Download this tutorial's complete package from the documentation site and extract it into an empty directory. When working from the source checkout, create the same package with:

```sh
python3 examples/devops/package.py --example 19 --output ./example-19
```

Enter the extracted directory containing `setup.py`. You need Python 3.11 or newer. Create an isolated environment and install the pinned example dependencies:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup.py
```

On Windows, use `.venv\Scripts\python.exe` in place of `.venv/bin/python`. Setup records the selected interpreters and prepares `local.workflow.yaml` with a matching explicit interpreter-basename grant. Review that generated workflow before running it. The authored [workflow.yaml](https://github.com/opensourceops/agentctl/blob/c223d012727a75de62112923d4da8befbe2068f2/examples/devops/19-role-subworkflow/workflow.yaml) remains readable and editable source.

The complete package contains:

```text
19-role-subworkflow/
  README.md
  contract.workflow.yaml
  example.json
  fixtures/change.txt
  fixtures/configuration.json
  format_operations.py
  helper.py
  instructions/executor.md
  instructions/planner.md
  instructions/reviewer.md
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

The primary workflow prepares a source digest and requested change, then calls a reusable sub-workflow with explicit plan, review, validation and handoff tasks. A failed review assertion blocks the executor. The final action accepts only the matching reviewed timeout and source digest, writes an output copy and verifies it. The separate agent variants assign planner, reviewer and executor roles distinct tool visibility; they must pass the same deterministic review boundary.

[Open the complete workflow](https://github.com/opensourceops/agentctl/blob/c223d012727a75de62112923d4da8befbe2068f2/examples/devops/19-role-subworkflow/workflow.yaml) to inspect its inputs, task dependencies, grants and bounds. The site embeds the same source below; editing a helper does not replace review of its host-process authority.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: devops-role-subworkflow
  description: Connect planner, reviewer, and executor through typed handoffs in a reusable sub-workflow with distinct tool visibility.
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
    plan-change:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - plan-change
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        required:
          - configurationPath
          - proposedTimeout
          - maxTimeout
        additionalProperties: false
        properties:
          configurationPath:
            type: string
          proposedTimeout:
            type: integer
          maxTimeout:
            type: integer
      outputSchema:
        type: object
        required:
          - configuration
          - sourceSha256
          - configurationPath
          - proposedTimeout
          - maxTimeout
          - allowed
          - scope
          - reportText
        additionalProperties: false
        properties:
          configuration:
            type: object
          sourceSha256:
            type: string
          configurationPath:
            type: string
          proposedTimeout:
            type: integer
          maxTimeout:
            type: integer
          allowed:
            type: boolean
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
    review-change:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - review-change
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        required:
          - context
          - proposal
          - review
        additionalProperties: false
        properties:
          context:
            type: object
          proposal:
            type: object
          review:
            type: object
      outputSchema:
        type: object
        required:
          - approved
          - timeoutSeconds
          - sourceSha256
          - decision
          - validation
          - reportText
        additionalProperties: false
        properties:
          approved:
            type: boolean
          timeoutSeconds:
            type: integer
          sourceSha256:
            type: string
          decision:
            type: string
          validation:
            type: string
          reportText:
            type: string
      capabilities:
        - devops.fixture
      timeoutSeconds: 30
      stdoutLimitBytes: 65536
      stderrLimitBytes: 8192
      combinedOutputLimitBytes: 73728
    apply-change:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - apply-change
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        required:
          - context
          - review
          - requireStagedValue
        additionalProperties: false
        properties:
          context:
            type: object
          review:
            type: object
          requireStagedValue:
            type: boolean
      outputSchema:
        type: object
        required:
          - executed
          - configuration
          - artifactSha256
          - originalPreserved
          - scope
          - reportText
        additionalProperties: false
        properties:
          executed:
            type: boolean
          configuration:
            type: object
          artifactSha256:
            type: string
          originalPreserved:
            type: boolean
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
    assign:
      kind: builtin.assign
    assert:
      kind: builtin.assert
    write:
      kind: builtin.write
  tasks:
    - id: prepare-change
      uses: action:plan-change
      with:
        configurationPath: '${{ inputs.configurationPath }}'
        proposedTimeout: '${{ inputs.proposedTimeout }}'
        maxTimeout: '${{ inputs.maxTimeout }}'
    - id: roles
      uses: workflow:change
      needs:
        - prepare-change
      with:
        context: '${{ tasks.prepare-change.output }}'
    - id: analyze
      uses: action:apply-change
      needs:
        - prepare-change
        - roles
      with:
        context: '${{ tasks.prepare-change.output }}'
        review: '${{ tasks.roles.output.review }}'
        requireStagedValue: false
    - id: report
      uses: action:write
      needs:
        - analyze
      with:
        path: artifacts/report.json
        content: '${{ tasks.analyze.output.reportText }}'
  inputs:
    configurationPath: fixtures/configuration.json
    proposedTimeout: 30
    maxTimeout: 60
  subworkflows:
    change:
      version: 1.0.0
      inputSchema:
        type: object
        required:
          - context
        additionalProperties: false
        properties:
          context:
            type: object
      outputSchema:
        type: object
        required:
          - review
        additionalProperties: false
        properties:
          review:
            type: object
            required:
              - approved
              - timeoutSeconds
              - sourceSha256
            additionalProperties: false
            properties:
              approved:
                type: boolean
              timeoutSeconds:
                type: integer
              sourceSha256:
                type: string
      outputs:
        review: '${{ tasks.handoff.output.output }}'
      tasks:
        - id: plan
          uses: action:assign
          with:
            timeoutSeconds: '${{ inputs.context.proposedTimeout }}'
        - id: review
          uses: action:assign
          needs:
            - plan
          with:
            approved: '${{ inputs.context.allowed }}'
            timeoutSeconds: '${{ inputs.context.proposedTimeout }}'
        - id: validate-review
          uses: action:review-change
          needs:
            - plan
            - review
          with:
            context: '${{ inputs.context }}'
            proposal: '${{ tasks.plan.output.output }}'
            review: '${{ tasks.review.output.output }}'
        - id: require-approval
          uses: action:assert
          needs:
            - validate-review
          with:
            that: '${{ tasks.validate-review.output.approved }}'
            message: reviewed change exceeds the configured maximum; executor is blocked
        - id: handoff
          uses: action:assign
          needs:
            - require-approval
            - validate-review
          with:
            approved: '${{ tasks.validate-review.output.approved }}'
            timeoutSeconds: '${{ tasks.validate-review.output.timeoutSeconds }}'
            sourceSha256: '${{ tasks.validate-review.output.sourceSha256 }}'
          outputSchema:
            type: object
            required:
              - status
              - changed
              - before
              - after
              - diff
              - output
              - predictability
            additionalProperties: false
            properties:
              status:
                const: unchanged
              changed:
                const: false
              before:
                type: 'null'
              after:
                type: object
                required:
                  - approved
                  - timeoutSeconds
                  - sourceSha256
                additionalProperties: false
                properties:
                  approved:
                    type: boolean
                  timeoutSeconds:
                    type: integer
                  sourceSha256:
                    type: string
              diff:
                type: 'null'
              output:
                type: object
                required:
                  - approved
                  - timeoutSeconds
                  - sourceSha256
                additionalProperties: false
                properties:
                  approved:
                    type: boolean
                  timeoutSeconds:
                    type: integer
                  sourceSha256:
                    type: string
              predictability:
                const: fully_predictable
  outputs:
    report: '${{ tasks.analyze.output }}'
```


## Expected result

Inspect the proposed values, reviewer decision and actual resulting artifact. Rejection must prevent executor mutation. The declared sub-workflow and individual agent tool lists make role boundaries visible in YAML.

Actual `reviewed-configuration.json` from the recorded provider-free walkthrough:

```json
{
  "retries": 2,
  "security": {
    "runAsNonRoot": true
  },
  "service": "api",
  "timeoutSeconds": 30
}
```

## Use your own data

Copy a configuration into the package and pass `--input configurationPath=fixtures/my-configuration.json --input proposedTimeout=25 --input maxTimeout=30`. A proposal of 25 is within that bound; 31 must be rejected. The resulting `artifacts/reviewed-configuration.json` preserves unrelated fields and leaves the supplied source unchanged. The primary workflow adapts without a model. `contract.workflow.yaml` teaches the agent protocol with scripted responses; `openai.workflow.yaml` separately evaluates bounded model behavior.

Paths in these inputs stay inside the package's reviewed workspace. Use ordinary vars for non-secret configuration only. An input or variable does not grant authority to a new filesystem path, command or network destination.

## Failure and recovery

A malformed handoff, an out-of-bounds proposal or reviewer rejection must block the executor. Typed schema compliance alone does not prove semantic correctness; the deterministic artifact check is the final boundary.

For a terminal successful run, reconstruct the recorded result without fresh effects:

```sh
agentctl replay RUN_ID --db state.db --output json --color never
```

For a failure, preserve the database and inspect task/effect status before choosing [resume, retry or repair](/agentctl/durable-execution/). A new run is a fresh invocation, not recovery of the old one.

## Authority and cleanup

The command uses the selected virtual environment's absolute interpreter path, while `processAllowlist` authorizes its basename. That generic Python grant trusts the reviewed helper; it does not pin one script or independently constrain its child processes. It is not an operating-system sandbox for every file access or child process made by Python. Only run the complete reviewed package on a trusted local machine or disposable runner. No production system is modified by this tutorial.

After saving needed reports and stopping this example's local service if present, remove only its disposable directory. The [optional acceptance suite](/agentctl/examples/devops/#contributor-verification) exercises additional denials, replay and failure injection; it is not required to run the published workflow.
