---
title: "Explain configuration drift"
description: "Edit YAML variable layers and inspect precedence without exposing secrets."
editUrl: "https://github.com/opensourceops/agentctl/edit/42922f9479f9b9cda360c36cf9b113ae4ce50f9a/examples/devops/11-configuration-drift/README.md"
---
> **Complete example package:** [Download all files](/agentctl/downloads/devops/11-configuration-drift.zip). Built from source [`42922f9479f9`](https://github.com/opensourceops/agentctl/tree/42922f9479f9b9cda360c36cf9b113ae4ce50f9a/examples/devops/11-configuration-drift). It includes the helper and setup step used below; download the complete package before editing a workflow.

**For:** Platform engineer. **Level and evidence:** Beginner; offline, no model.

Make effective configuration visible by layering variable files, task defaults and explicit invocation overrides.

## Get the complete example

Install the [matching agentctl binary](/agentctl/getting-started/installation/). Download this tutorial's complete package from the documentation site and extract it into an empty directory. When working from the source checkout, create the same package with:

```sh
python3 examples/devops/package.py --example 11 --output ./example-11
```

Enter the extracted directory containing `setup.py`. You need Python 3.11 or newer. Create an isolated environment and install the pinned example dependencies:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup.py
```

On Windows, use `.venv\Scripts\python.exe` in place of `.venv/bin/python`. Setup records the selected interpreters and prepares `local.workflow.yaml` with a matching explicit interpreter-basename grant. Review that generated workflow before running it. The authored [workflow.yaml](https://github.com/opensourceops/agentctl/blob/42922f9479f9b9cda360c36cf9b113ae4ce50f9a/examples/devops/11-configuration-drift/workflow.yaml) remains readable and editable source.

The complete package contains:

```text
11-configuration-drift/
  README.md
  example.json
  fixtures/actual.json
  format_operations.py
  helper.py
  local_service.py
  operations.py
  requirements.txt
  service_operations.py
  setup.py
  vars/base.yaml
  vars/environment.json
  vars/task.json
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

Workflow files load in order, then inline workflow values apply. Agent defaults and task overrides follow, with invocation variable files and inline flags last. Keys replace whole values; an object replacement does not implicitly deep-merge its old keys. Typed inputs remain a separate namespace.

[Open the complete workflow](https://github.com/opensourceops/agentctl/blob/42922f9479f9b9cda360c36cf9b113ae4ce50f9a/examples/devops/11-configuration-drift/workflow.yaml) to inspect its inputs, task dependencies, grants and bounds. The site embeds the same source below; editing a helper does not replace review of its host-process authority.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: devops-configuration-drift
  description: Layer external variable files and task overrides, keep invocation inputs separate, and report configuration drift.
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
    write:
      kind: builtin.write
    compare-config:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - configuration-drift
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        required:
          - actualPath
          - desired
          - environment
        additionalProperties: false
        properties:
          actualPath:
            type: string
          desired:
            type: object
          environment:
            type: string
      outputSchema:
        type: object
        required:
          - desired
          - actual
          - drift
          - inputEnvironment
          - reportText
        additionalProperties: false
        properties:
          desired:
            type: object
          actual:
            type: object
          drift:
            type: array
          inputEnvironment:
            type: string
          reportText:
            type: string
      capabilities:
        - devops.fixture
      timeoutSeconds: 30
      stdoutLimitBytes: 65536
      stderrLimitBytes: 8192
      combinedOutputLimitBytes: 73728
  tasks:
    - id: analyze
      uses: action:compare-config
      with:
        actualPath: '${{ inputs.actualPath }}'
        desired:
          replicas: '${{ vars.replicas }}'
          region: '${{ vars.region }}'
          settings: '${{ vars.settings }}'
        environment: '${{ inputs.environment }}'
      varsFiles:
        - vars/task.json
      vars:
        replicas: 4
    - id: report
      uses: action:write
      needs:
        - analyze
      with:
        path: artifacts/report.json
        content: '${{ tasks.analyze.output.reportText }}'
  varsFiles:
    - vars/base.yaml
    - vars/environment.json
  vars:
    region: fixture
  inputs:
    environment: disposable
    actualPath: fixtures/actual.json
  outputs:
    report: '${{ tasks.analyze.output }}'
```


## Expected result

The default task observes `replicas: 4` and `settings: {timeout: 20}`; an older nested key is absent after replacement. `artifacts/report.json` compares desired values with `fixtures/actual.json`. `explain` reveals winning origins without printing variable values.

Selected fields from the supplied fixture's `artifacts/report.json`:

```json
{
  "desired": {
    "region": "fixture",
    "replicas": 4,
    "settings": {
      "timeout": 20
    }
  },
  "inputEnvironment": "disposable"
}
```

## Use your own data

Edit `vars/base.yaml`, `vars/environment.json`, `vars/task.json` and the task inline mapping. Run `agentctl explain local.workflow.yaml --workspace . --output json`, then run with `--var replicas=6 --input environment=staging`. The task sees six replicas while `inputs.environment` changes independently.

Paths in these inputs stay inside the package's reviewed workspace. Use ordinary vars for non-secret configuration only. An input or variable does not grant authority to a new filesystem path, command or network destination.

## Failure and recovery

A missing file, duplicate YAML key, unknown template input or a source outside the allowed workspace fails before dispatch. Source files are captured for a run: edits affect a new invocation or compatible repair, not the source of truth for recorded replay. See the variables guide for full precedence.

For a terminal successful run, reconstruct the recorded result without fresh effects:

```sh
agentctl replay RUN_ID --db state.db --output json --color never
```

For a failure, preserve the database and inspect task/effect status before choosing [resume, retry or repair](/agentctl/durable-execution/). A new run is a fresh invocation, not recovery of the old one.

## Authority and cleanup

The command uses the selected virtual environment's absolute interpreter path, while `processAllowlist` authorizes its basename. That generic Python grant trusts the reviewed helper; it does not pin one script or independently constrain its child processes. It is not an operating-system sandbox for every file access or child process made by Python. Only run the complete reviewed package on a trusted local machine or disposable runner. No production system is modified by this tutorial.

After saving needed reports and stopping this example's local service if present, remove only its disposable directory. The [optional acceptance suite](/agentctl/examples/devops/#contributor-verification) exercises additional denials, replay and failure injection; it is not required to run the published workflow.
