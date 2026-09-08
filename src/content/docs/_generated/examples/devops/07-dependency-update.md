---
title: "Validate a vendored-code patch"
description: "Apply a supplied patch and compare failing and passing tests."
editUrl: "https://github.com/opensourceops/agentctl/edit/7dee64e1d1b6fd38c1883d0d235d712590c30fbe/examples/devops/07-dependency-update/README.md"
---
> **Complete example package:** [Download all files](/agentctl/downloads/devops/07-dependency-update.zip). Built from source [`7dee64e1d1b6`](https://github.com/opensourceops/agentctl/tree/7dee64e1d1b6fd38c1883d0d235d712590c30fbe/examples/devops/07-dependency-update). It includes the helper and setup step used below; download the complete package before editing a workflow.

**For:** CI developer. **Level and evidence:** Intermediate; offline, Python and Git.

Apply a supplied patch to vendored code in a disposable workspace and prove a behavior fails before the patch and passes afterward.

## Get the complete example

Install the [matching agentctl binary](/agentctl/getting-started/installation/). Download this tutorial's complete package from the documentation site and extract it into an empty directory. When working from the source checkout, create the same package with:

```sh
python3 examples/devops/package.py --example 07 --output ./example-07
```

Enter the extracted directory containing `setup.py`. You need Python 3.11 or newer. Git is also required. Create an isolated environment and install the pinned example dependencies:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup.py
```

On Windows, use `.venv\Scripts\python.exe` in place of `.venv/bin/python`. Setup records the selected interpreters and prepares `local.workflow.yaml` with a matching explicit interpreter-basename grant. Review that generated workflow before running it. The authored [workflow.yaml](https://github.com/opensourceops/agentctl/blob/7dee64e1d1b6fd38c1883d0d235d712590c30fbe/examples/devops/07-dependency-update/workflow.yaml) remains readable and editable source.

The complete package contains:

```text
07-dependency-update/
  README.md
  example.json
  fixtures/test_dependency.py
  fixtures/update.patch
  fixtures/vendor_version.py
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

The workflow keeps the original target, supplied change and test evidence inspectable. A clean patch application alone is insufficient: the behavioral test must demonstrate the defect and its correction.

[Open the complete workflow](https://github.com/opensourceops/agentctl/blob/7dee64e1d1b6fd38c1883d0d235d712590c30fbe/examples/devops/07-dependency-update/workflow.yaml) to inspect its inputs, task dependencies, grants and bounds. The site embeds the same source below; editing a helper does not replace review of its host-process authority.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: devops-dependency-update
  description: Apply a vendored dependency update in a disposable workspace and prove three behavioral tests change from failing to passing.
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
    prepare-patch:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - vendor-prepare
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - targetPath
          - testPath
          - patchPath
        properties:
          targetPath:
            type: string
          testPath:
            type: string
          patchPath:
            type: string
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - targetName
          - sourceSha256
          - proposedSha256
          - patchSha256
          - testName
          - testSha256
          - scope
          - reportText
        properties:
          targetName:
            type: string
          sourceSha256:
            type: string
          proposedSha256:
            type: string
          patchSha256:
            type: string
          testName:
            type: string
          testSha256:
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
    test-before:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - vendor-test-before
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - targetName
          - sourceSha256
          - testName
          - testSha256
        properties:
          targetName:
            type: string
          sourceSha256:
            type: string
          testName:
            type: string
          testSha256:
            type: string
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - baselineExit
          - tests
          - reportText
        properties:
          baselineExit:
            type: integer
          tests:
            type: integer
          reportText:
            type: string
      capabilities:
        - devops.fixture
      timeoutSeconds: 30
      stdoutLimitBytes: 65536
      stderrLimitBytes: 8192
      combinedOutputLimitBytes: 73728
    apply-patch:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - vendor-apply
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - targetName
          - sourceSha256
          - proposedSha256
          - patchSha256
        properties:
          targetName:
            type: string
          sourceSha256:
            type: string
          proposedSha256:
            type: string
          patchSha256:
            type: string
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - appliedAndVerified
          - reused
          - sha256
          - reportText
        properties:
          appliedAndVerified:
            type: boolean
          reused:
            type: boolean
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
    test-after:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - vendor-test-after
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - targetName
          - proposedSha256
          - baselineTests
          - testName
          - testSha256
        properties:
          targetName:
            type: string
          proposedSha256:
            type: string
          baselineTests:
            type: integer
          testName:
            type: string
          testSha256:
            type: string
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - baselineExit
          - updatedExit
          - tests
          - scope
          - reportText
        properties:
          baselineExit:
            type: integer
          updatedExit:
            type: integer
          tests:
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
    - id: prepare
      uses: action:prepare-patch
      with:
        targetPath: '${{ inputs.targetPath }}'
        testPath: '${{ inputs.testPath }}'
        patchPath: '${{ inputs.patchPath }}'
    - id: baseline
      uses: action:test-before
      needs:
        - prepare
      with:
        targetName: '${{ tasks.prepare.output.targetName }}'
        sourceSha256: '${{ tasks.prepare.output.sourceSha256 }}'
        testName: '${{ tasks.prepare.output.testName }}'
        testSha256: '${{ tasks.prepare.output.testSha256 }}'
    - id: apply
      uses: action:apply-patch
      needs:
        - prepare
        - baseline
      with:
        targetName: '${{ tasks.prepare.output.targetName }}'
        sourceSha256: '${{ tasks.prepare.output.sourceSha256 }}'
        proposedSha256: '${{ tasks.prepare.output.proposedSha256 }}'
        patchSha256: '${{ tasks.prepare.output.patchSha256 }}'
    - id: analyze
      uses: action:test-after
      needs:
        - prepare
        - baseline
        - apply
      with:
        targetName: '${{ tasks.prepare.output.targetName }}'
        proposedSha256: '${{ tasks.prepare.output.proposedSha256 }}'
        testName: '${{ tasks.prepare.output.testName }}'
        testSha256: '${{ tasks.prepare.output.testSha256 }}'
        baselineTests: '${{ tasks.baseline.output.tests }}'
    - id: report
      uses: action:write
      needs:
        - analyze
      with:
        path: artifacts/report.json
        content: '${{ tasks.analyze.output.reportText }}'
  inputs:
    targetPath: fixtures/vendor_version.py
    testPath: fixtures/test_dependency.py
    patchPath: fixtures/update.patch
  outputs:
    report: '${{ tasks.analyze.output }}'
```


## Expected result

Inspect `artifacts/proposed.patch`, the patched target and test results. This is a vendored-code fix. It does not resolve a package-manager dependency graph, download packages, or prove compatibility with every downstream consumer.

Selected fields from the supplied fixture's `artifacts/report.json`:

```json
{
  "baselineExit": 1,
  "updatedExit": 0,
  "tests": 3
}
```

## Use your own data

Supply `fixtures/update.patch`, the target source and focused test fixture. The workflow inputs `targetPath`, `patchPath` and `testPath` select these files; it does not infer a change by comparing against an updated.py file. Keep the target beneath the disposable workspace. Adapt the test to the behavior being corrected rather than changing assertions merely to match the proposed implementation.

Paths in these inputs stay inside the package's reviewed workspace. Use ordinary vars for non-secret configuration only. An input or variable does not grant authority to a new filesystem path, command or network destination.

## Failure and recovery

Reject a patch that touches an unexpected path, does not apply, or leaves the test failing. Do not apply this tutorial directly to your production checkout; copy the validated change into a separately reviewed branch.

For a terminal successful run, reconstruct the recorded result without fresh effects:

```sh
agentctl replay RUN_ID --db state.db --output json --color never
```

For a failure, preserve the database and inspect task/effect status before choosing [resume, retry or repair](/agentctl/durable-execution/). A new run is a fresh invocation, not recovery of the old one.

## Authority and cleanup

The command uses the selected virtual environment's absolute interpreter path, while `processAllowlist` authorizes its basename. That generic Python grant trusts the reviewed helper; it does not pin one script or independently constrain its child processes. It is not an operating-system sandbox for every file access or child process made by Python. Only run the complete reviewed package on a trusted local machine or disposable runner. No production system is modified by this tutorial.

After saving needed reports and stopping this example's local service if present, remove only its disposable directory. The [optional acceptance suite](/agentctl/examples/devops/#contributor-verification) exercises additional denials, replay and failure injection; it is not required to run the published workflow.
