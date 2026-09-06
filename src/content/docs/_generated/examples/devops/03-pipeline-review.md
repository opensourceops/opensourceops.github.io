---
title: "Review a GitHub Actions pipeline"
description: "Inspect permissions and validate a narrow proposed YAML patch."
editUrl: "https://github.com/opensourceops/agentctl/edit/68e5b8e738f099487c7af9fe1b043ab2c1a5d0b0/examples/devops/03-pipeline-review/README.md"
---
> **Complete example package:** [Download all files](/agentctl/downloads/devops/03-pipeline-review.zip). Built from source [`68e5b8e738f0`](https://github.com/opensourceops/agentctl/tree/68e5b8e738f099487c7af9fe1b043ab2c1a5d0b0/examples/devops/03-pipeline-review). It includes the helper and setup step used below; download the complete package before editing a workflow.

**For:** CI developer. **Level and evidence:** Intermediate; offline, Python and Git plus the declared validator.

Find excessive job permissions and missing execution bounds, inspect a narrow patch, and validate the resulting workflow.

## Get the complete example

Install the [matching agentctl binary](/agentctl/getting-started/installation/). Download this tutorial's complete package from the documentation site and extract it into an empty directory. When working from the source checkout, create the same package with:

```sh
python3 examples/devops/package.py --example 03 --output ./example-03
```

Enter the extracted directory containing `setup.py`. You need Python 3.11 or newer. Git is also required. Create an isolated environment and install the pinned example dependencies:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup.py
```

On Windows, use `.venv\Scripts\python.exe` in place of `.venv/bin/python`. Setup records the selected interpreters and prepares `local.workflow.yaml` with a matching explicit interpreter-basename grant. Review that generated workflow before running it. The authored [workflow.yaml](https://github.com/opensourceops/agentctl/blob/68e5b8e738f099487c7af9fe1b043ab2c1a5d0b0/examples/devops/03-pipeline-review/workflow.yaml) remains readable and editable source.

The complete package contains:

```text
03-pipeline-review/
  README.md
  example.json
  fixtures/pipeline.yaml
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

The workflow separates local input review from the proposed change and validation. Review the permission rules and the patch before adapting them to a real repository. The local patch workspace preserves unrelated YAML fields.

[Open the complete workflow](https://github.com/opensourceops/agentctl/blob/68e5b8e738f099487c7af9fe1b043ab2c1a5d0b0/examples/devops/03-pipeline-review/workflow.yaml) to inspect its inputs, task dependencies, grants and bounds. The site embeds the same source below; editing a helper does not replace review of its host-process authority.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: devops-pipeline-review
  description: Find excess permissions and unbounded timeouts, then check and apply a reviewable Git patch.
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
    propose-pipeline:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - pipeline-propose
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - sourcePath
          - maxTimeoutMinutes
        properties:
          sourcePath:
            type: string
          maxTimeoutMinutes:
            type: integer
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - proposalPath
          - patchPath
          - sourceSha256
          - proposedSha256
          - violations
          - reportText
        properties:
          proposalPath:
            type: string
          patchPath:
            type: string
          sourceSha256:
            type: string
          proposedSha256:
            type: string
          violations:
            type: array
          reportText:
            type: string
      capabilities:
        - devops.fixture
      timeoutSeconds: 30
      stdoutLimitBytes: 65536
      stderrLimitBytes: 8192
      combinedOutputLimitBytes: 73728
    validate-pipeline:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - pipeline-validate
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - sourcePath
          - proposalPath
          - maxTimeoutMinutes
          - requireActionlint
          - actionlintPath
        properties:
          sourcePath:
            type: string
          proposalPath:
            type: string
          maxTimeoutMinutes:
            type: integer
          requireActionlint:
            type: boolean
          actionlintPath:
            type: string
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - violations
          - patch
          - validated
          - validationScope
          - actionlint
          - reportText
        properties:
          violations:
            type: array
          patch:
            type: object
          validated:
            type: boolean
          validationScope:
            type: string
          actionlint:
            type: object
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
    - id: propose
      uses: action:propose-pipeline
      with:
        sourcePath: '${{ inputs.sourcePath }}'
        maxTimeoutMinutes: '${{ inputs.maxTimeoutMinutes }}'
    - id: analyze
      uses: action:validate-pipeline
      needs:
        - propose
      with:
        sourcePath: '${{ inputs.sourcePath }}'
        proposalPath: '${{ tasks.propose.output.proposalPath }}'
        maxTimeoutMinutes: '${{ inputs.maxTimeoutMinutes }}'
        requireActionlint: '${{ inputs.requireActionlint }}'
        actionlintPath: '${{ inputs.actionlintPath }}'
    - id: report
      uses: action:write
      needs:
        - analyze
      with:
        path: artifacts/report.json
        content: '${{ tasks.analyze.output.reportText }}'
  inputs:
    sourcePath: fixtures/pipeline.yaml
    maxTimeoutMinutes: 15
    requireActionlint: false
    actionlintPath: tools/actionlint
  outputs:
    report: '${{ tasks.analyze.output }}'
```


## Expected result

Inspect `artifacts/proposed.patch`, the patched workflow under `artifacts/patch-workspace`, and the structured report. The patch must apply cleanly and the resulting GitHub Actions document must preserve unrelated fields and meet the local permission/timeout rules. The separate actionlint path validates GitHub Actions syntax and expressions; a report with actionlint unverified does not establish that broader result. This does not execute the pipeline on GitHub.

Selected fields from the supplied fixture's `artifacts/report.json`:

```json
{
  "violations": [
    {
      "location": "/permissions",
      "rule": "least-privilege"
    },
    {
      "location": "/jobs/test/timeout-minutes",
      "rule": "bounded-job"
    }
  ],
  "validated": true,
  "actionlint": {
    "scope": "local permission/timeout rules only; GitHub Actions syntax and expressions require actionlint",
    "status": "unverified",
    "version": null
  }
}
```

## Use your own data

Replace `fixtures/pipeline.yaml` with your actual GitHub Actions YAML, or pass `--input sourcePath=fixtures/my-pipeline.yaml`. Review the explicit `contents: read` permission recipe and `maxTimeoutMinutes` input; reusable-workflow call jobs require a different recipe. Keep credentials and repository secrets out of copied input files. A job that legitimately publishes needs a separately reviewed permission decision; a generic rule must not silently grant it.

Paths in these inputs stay inside the package's reviewed workspace. Use ordinary vars for non-secret configuration only. An input or variable does not grant authority to a new filesystem path, command or network destination.

## Add GitHub Actions syntax validation

For the optional broader check, download the archive for your operating system and architecture from the [actionlint 1.7.7 release](https://github.com/rhysd/actionlint/releases/tag/v1.7.7), verify it against that release's checksum file, and extract the executable into this package as `tools/actionlint` (`tools/actionlint.exe` on Windows). The workflow does not download tools. Keep this executable inside the reviewed workspace.

On macOS or Linux, verify the selected binary and require it explicitly:

```sh
tools/actionlint --version
agentctl run local.workflow.yaml --workspace . --db state.db --input requireActionlint=true --input actionlintPath=tools/actionlint --output json
agentctl inspect RUN_ID --db state.db --output json
```

On Windows, use `tools/actionlint.exe` for both the version command and `actionlintPath`. The helper requires version `1.7.7`. Inspect `artifacts/actionlint.txt` and the report's `actionlint.status`. This mode checks GitHub Actions syntax and expressions; optional ShellCheck and pyflakes discovery are disabled so the result does not depend on undeclared host tools. It still does not run hosted jobs.

## Failure and recovery

Malformed YAML, unsupported workflow structure or an invalid proposed patch stops the workflow. When `requireActionlint` is true, an unavailable or differently versioned actionlint also stops validation. A passing local validator does not establish that third-party Actions are trusted or that hosted jobs will pass.

For a terminal successful run, reconstruct the recorded result without fresh effects:

```sh
agentctl replay RUN_ID --db state.db --output json --color never
```

For a failure, preserve the database and inspect task/effect status before choosing [resume, retry or repair](/agentctl/durable-execution/). A new run is a fresh invocation, not recovery of the old one.

## Authority and cleanup

The command uses the selected virtual environment's absolute interpreter path, while `processAllowlist` authorizes its basename. That generic Python grant trusts the reviewed helper; it does not pin one script or independently constrain its child processes. It is not an operating-system sandbox for every file access or child process made by Python. Only run the complete reviewed package on a trusted local machine or disposable runner. No production system is modified by this tutorial.

After saving needed reports and stopping this example's local service if present, remove only its disposable directory. The [optional acceptance suite](/agentctl/examples/devops/#contributor-verification) exercises additional denials, replay and failure injection; it is not required to run the published workflow.
