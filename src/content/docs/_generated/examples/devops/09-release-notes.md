---
title: "Generate evidenced release notes"
description: "Read a repository and explicit ref range without changing its history."
editUrl: "https://github.com/opensourceops/agentctl/edit/c223d012727a75de62112923d4da8befbe2068f2/examples/devops/09-release-notes/README.md"
---
> **Complete example package:** [Download all files](/agentctl/downloads/devops/09-release-notes.zip). Built from source [`c223d012727a`](https://github.com/opensourceops/agentctl/tree/c223d012727a75de62112923d4da8befbe2068f2/examples/devops/09-release-notes). It includes the helper and setup step used below; download the complete package before editing a workflow.

**For:** Release engineer. **Level and evidence:** Beginner; offline, Python and Git.

Generate a changelog from an existing Git repository and explicit commit range without mutating that repository.

## Get the complete example

Install the [matching agentctl binary](/agentctl/getting-started/installation/). Download this tutorial's complete package from the documentation site and extract it into an empty directory. When working from the source checkout, create the same package with:

```sh
python3 examples/devops/package.py --example 09 --output ./example-09
```

Enter the extracted directory containing `setup.py`. You need Python 3.11 or newer. Git is also required. Create an isolated environment and install the pinned example dependencies:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup.py
```

On Windows, use `.venv\Scripts\python.exe` in place of `.venv/bin/python`. Setup records the selected interpreters and prepares `local.workflow.yaml` with a matching explicit interpreter-basename grant. Review that generated workflow before running it. The authored [workflow.yaml](https://github.com/opensourceops/agentctl/blob/c223d012727a75de62112923d4da8befbe2068f2/examples/devops/09-release-notes/workflow.yaml) remains readable and editable source.

The complete package contains:

```text
09-release-notes/
  README.md
  example.json
  fixtures/history.json
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

Setup may create the disposable fixture history once. The operational action only resolves the supplied refs, reads commits and changed paths, and writes release notes beneath `artifacts`. The range excludes `fromRef` and includes `toRef`, with a 500-commit ceiling.

[Open the complete workflow](https://github.com/opensourceops/agentctl/blob/c223d012727a75de62112923d4da8befbe2068f2/examples/devops/09-release-notes/workflow.yaml) to inspect its inputs, task dependencies, grants and bounds. The site embeds the same source below; editing a helper does not replace review of its host-process authority.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: devops-release-notes
  description: Analyze an existing Git revision range and link release-note entries to commits and changed files.
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
    collect-release-notes:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - release-notes
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - repositoryPath
          - fromRef
          - toRef
          - outputPath
        properties:
          repositoryPath:
            type: string
          fromRef:
            type: string
          toRef:
            type: string
          outputPath:
            type: string
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - notes
          - commitsVerified
          - fromCommit
          - toCommit
          - outputPath
          - scope
          - reportText
        properties:
          notes:
            type: array
          commitsVerified:
            type: integer
          fromCommit:
            type: string
          toCommit:
            type: string
          outputPath:
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
    - id: analyze
      uses: action:collect-release-notes
      with:
        repositoryPath: '${{ inputs.repositoryPath }}'
        fromRef: '${{ inputs.fromRef }}'
        toRef: '${{ inputs.toRef }}'
        outputPath: '${{ inputs.outputPath }}'
    - id: report
      uses: action:write
      needs:
        - analyze
      with:
        path: artifacts/report.json
        content: '${{ tasks.analyze.output.reportText }}'
  inputs:
    repositoryPath: fixtures/repository
    fromRef: fixture-base
    toRef: HEAD
    outputPath: artifacts/CHANGELOG.md
  outputs:
    report: '${{ tasks.analyze.output }}'
```


## Expected result

Inspect `artifacts/CHANGELOG.md` and the report containing resolved full commit IDs. Each note names its source commit and changed files. Two identical runs produce the same changelog bytes and leave repository history unchanged.

Selected fields from the supplied fixture's `artifacts/report.json`:

```json
{
  "commitsVerified": 3,
  "outputPath": "artifacts/CHANGELOG.md"
}
```

The complete report also contains full commit IDs and changed-file evidence. Your repository or freshly prepared fixture history can have different commit IDs.

## Use your own data

Copy your repository beneath the package, then pass `--input repositoryPath=fixtures/my-repo --input fromRef=v0.2.0 --input toRef=v0.3.0`. Use explicit reviewed refs; refs beginning with an option prefix are rejected. The helper does not fetch remotes.

Paths in these inputs stay inside the package's reviewed workspace. Use ordinary vars for non-secret configuration only. An input or variable does not grant authority to a new filesystem path, command or network destination.

## Failure and recovery

Missing refs, an excessive range or an output path outside `artifacts` fail. Repeating analysis is idempotent. Fixture preparation refuses to alter an existing unmarked user repository; use a new directory when changing the fixture history.

For a terminal successful run, reconstruct the recorded result without fresh effects:

```sh
agentctl replay RUN_ID --db state.db --output json --color never
```

For a failure, preserve the database and inspect task/effect status before choosing [resume, retry or repair](/agentctl/durable-execution/). A new run is a fresh invocation, not recovery of the old one.

## Authority and cleanup

The command uses the selected virtual environment's absolute interpreter path, while `processAllowlist` authorizes its basename. That generic Python grant trusts the reviewed helper; it does not pin one script or independently constrain its child processes. It is not an operating-system sandbox for every file access or child process made by Python. Only run the complete reviewed package on a trusted local machine or disposable runner. No production system is modified by this tutorial.

After saving needed reports and stopping this example's local service if present, remove only its disposable directory. The [optional acceptance suite](/agentctl/examples/devops/#contributor-verification) exercises additional denials, replay and failure injection; it is not required to run the published workflow.
