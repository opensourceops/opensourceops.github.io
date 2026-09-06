---
title: "Review a Dockerfile"
description: "Inspect a Dockerfile patch and optionally build a disposable image."
editUrl: "https://github.com/opensourceops/agentctl/edit/45d0995345ba048d8a8368466f56c388cc8cb992/examples/devops/04-dockerfile-review/README.md"
---
> **Candidate example package:** [Download all files](/agentctl/downloads/devops/04-dockerfile-review.zip). Built from source [`45d0995345ba`](https://github.com/opensourceops/agentctl/tree/45d0995345ba048d8a8368466f56c388cc8cb992/examples/devops/04-dockerfile-review). It includes the helper and setup step used below; download the complete package before editing a workflow.

**For:** Platform engineer. **Level and evidence:** Intermediate; offline review uses Python and Git. An optional real image gate needs Docker or Podman.

Inspect a proposed Dockerfile patch that narrows copied content and runs the application as a non-root user.

## Get the complete example

Install the [matching candidate binary](/agentctl/getting-started/installation/). Download this tutorial's complete package from the documentation site and extract it into an empty directory. When working from the source checkout, create the same package with:

```sh
python3 examples/devops/package.py --example 04 --output ./example-04
```

Enter the extracted directory containing `setup.py`. You need Python 3.11 or newer. Git is also required. Create an isolated environment and install the pinned example dependencies:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup.py
```

On Windows, use `.venv\Scripts\python.exe` in place of `.venv/bin/python`. Setup records the selected interpreters and prepares `local.workflow.yaml` with a matching explicit interpreter-basename grant. Review that generated workflow before running it. The authored [workflow.yaml](https://github.com/opensourceops/agentctl/blob/45d0995345ba048d8a8368466f56c388cc8cb992/examples/devops/04-dockerfile-review/workflow.yaml) remains readable and editable source.

The complete package contains:

```text
04-dockerfile-review/
  README.md
  example.json
  fixtures/Dockerfile
  fixtures/app.py
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

The helper generates and checks a patch in a disposable directory. Source checks establish the proposed bytes and Python syntax. Building and probing an actual image is a separate opt-in operation, so its evidence cannot be inferred from a successful text review.

[Open the complete workflow](https://github.com/opensourceops/agentctl/blob/45d0995345ba048d8a8368466f56c388cc8cb992/examples/devops/04-dockerfile-review/workflow.yaml) to inspect its inputs, task dependencies, grants and bounds. The site embeds the same source below; editing a helper does not replace review of its host-process authority.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: devops-dockerfile-review
  description: Narrow copied files, use a non-root identity, validate Python syntax, and optionally build and execute the container.
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
    propose-dockerfile:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - dockerfile-propose
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - sourcePath
        properties:
          sourcePath:
            type: string
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - proposalPath
          - patchPath
          - sourceSha256
          - proposedSha256
          - improvements
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
          improvements:
            type: array
          reportText:
            type: string
      capabilities:
        - devops.fixture
      timeoutSeconds: 30
      stdoutLimitBytes: 65536
      stderrLimitBytes: 8192
      combinedOutputLimitBytes: 73728
    validate-dockerfile:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - dockerfile-validate
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - sourcePath
          - proposalPath
          - appPath
        properties:
          sourcePath:
            type: string
          proposalPath:
            type: string
          appPath:
            type: string
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - improvements
          - patch
          - syntaxValidated
          - validationScope
          - containerBuild
          - performanceClaim
          - reportText
        properties:
          improvements:
            type: array
          patch:
            type: object
          syntaxValidated:
            type: boolean
          validationScope:
            type: string
          containerBuild:
            type: string
          performanceClaim:
            type: 'null'
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
      uses: action:propose-dockerfile
      with:
        sourcePath: '${{ inputs.sourcePath }}'
    - id: analyze
      uses: action:validate-dockerfile
      needs:
        - propose
      with:
        sourcePath: '${{ inputs.sourcePath }}'
        proposalPath: '${{ tasks.propose.output.proposalPath }}'
        appPath: '${{ inputs.appPath }}'
    - id: report
      uses: action:write
      needs:
        - analyze
      with:
        path: artifacts/report.json
        content: '${{ tasks.analyze.output.reportText }}'
  inputs:
    sourcePath: fixtures/Dockerfile
    appPath: fixtures/app.py
  outputs:
    report: '${{ tasks.analyze.output }}'
```


## Expected result

Read `artifacts/proposed.patch` and the patched Dockerfile before running a build. The normal report records that the container gate was not executed. When the optional gate runs, retain the immutable base reference, resulting image ID, non-root identity and health output.

Selected fields from the supplied fixture's `artifacts/report.json`:

```json
{
  "improvements": [
    "explicit-copy",
    "non-root-user"
  ],
  "syntaxValidated": true,
  "performanceClaim": null
}
```

## Use your own data

Replace the local Dockerfile and application fixtures with a small service of your own. Review the proposed COPY and USER changes against its runtime needs. Supply a digest-pinned, already available base image for an offline build.

Paths in these inputs stay inside the package's reviewed workspace. Use ordinary vars for non-secret configuration only. An input or variable does not grant authority to a new filesystem path, command or network destination.

## Optional real image gate

After reviewing `artifacts/Dockerfile` and `artifacts/app.py`, use a working Docker engine to build and probe the actual image. These POSIX-shell commands resolve the downloaded base image to its immutable repository digest before the build:

```sh
docker pull python:3.12-slim
AGENTCTL_EXAMPLE_BASE=$(docker image inspect python:3.12-slim --format '{{index .RepoDigests 0}}')
docker build --pull=false --network=none --build-arg "BASE_IMAGE=$AGENTCTL_EXAMPLE_BASE" --file artifacts/Dockerfile --tag agentctl-cookbook-04:local artifacts
docker image inspect agentctl-cookbook-04:local --format '{{.Id}} {{.Config.User}}'
docker run --rm --network=none --read-only agentctl-cookbook-04:local
docker image rm agentctl-cookbook-04:local
```

The supplied application prints `{"service":"fixture","healthy":true}` and the configured user is non-root. Save the base digest, image ID and actual probe output with your evidence. The first pull uses the network; the build and run disable it. Substitute `podman` consistently when using Podman. The cached base image remains after cleanup.

## Failure and recovery

A failed patch or syntax check blocks success. A missing container engine does not invalidate source review, but it leaves image execution unverified. No speed, memory, image-size or cost improvement is claimed by this example.

For a terminal successful run, reconstruct the recorded result without fresh effects:

```sh
agentctl replay RUN_ID --db state.db --output json --color never
```

For a failure, preserve the database and inspect task/effect status before choosing [resume, retry or repair](/agentctl/durable-execution/). A new run is a fresh invocation, not recovery of the old one.

## Authority and cleanup

The command uses the selected virtual environment's absolute interpreter path, while `processAllowlist` authorizes its basename. That generic Python grant trusts the reviewed helper; it does not pin one script or independently constrain its child processes. It is not an operating-system sandbox for every file access or child process made by Python. Only run the complete reviewed package on a trusted local machine or disposable runner. No production system is modified by this tutorial.

After saving needed reports and stopping this example's local service if present, remove only its disposable directory. The [optional acceptance suite](/agentctl/examples/devops/#contributor-verification) exercises additional denials, replay and failure injection; it is not required to run the published workflow.
