---
title: "Triage JUnit test results"
description: "Classify failures and errors without inventing infrastructure causes."
editUrl: "https://github.com/opensourceops/agentctl/edit/bb8fb0a5a28d876fee26c49c49a8a5bf1c8390e2/examples/devops/02-junit-triage/README.md"
---
> **Complete example package:** [Download all files](/agentctl/downloads/devops/02-junit-triage.zip). Built from source [`bb8fb0a5a28d`](https://github.com/opensourceops/agentctl/tree/bb8fb0a5a28d876fee26c49c49a8a5bf1c8390e2/examples/devops/02-junit-triage). It includes the helper and setup step used below; download the complete package before editing a workflow.

**For:** CI developer. **Level and evidence:** Beginner; offline, no model.

Turn a JUnit XML report into a report of failed tests, preserved error types, skipped cases and source references.

## Get the complete example

Install the [matching agentctl binary](/agentctl/getting-started/installation/). Download this tutorial's complete package from the documentation site and extract it into an empty directory. When working from the source checkout, create the same package with:

```sh
python3 examples/devops/package.py --example 02 --output ./example-02
```

Enter the extracted directory containing `setup.py`. You need Python 3.11 or newer. Create an isolated environment and install the pinned example dependencies:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup.py
```

On Windows, use `.venv\Scripts\python.exe` in place of `.venv/bin/python`. Setup records the selected interpreters and prepares `local.workflow.yaml` with a matching explicit interpreter-basename grant. Review that generated workflow before running it. The authored [workflow.yaml](https://github.com/opensourceops/agentctl/blob/bb8fb0a5a28d876fee26c49c49a8a5bf1c8390e2/examples/devops/02-junit-triage/workflow.yaml) remains readable and editable source.

The complete package contains:

```text
02-junit-triage/
  README.md
  example.json
  fixtures/junit.xml
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

The parser traverses test suites, preserves the JUnit `failure` versus `error` distinction, and classifies each issue separately. Infrastructure classification requires connectivity or availability evidence. An application `ValueError` remains an application issue; an unrecognized error remains unknown.

[Open the complete workflow](https://github.com/opensourceops/agentctl/blob/bb8fb0a5a28d876fee26c49c49a8a5bf1c8390e2/examples/devops/02-junit-triage/workflow.yaml) to inspect its inputs, task dependencies, grants and bounds. The site embeds the same source below; editing a helper does not replace review of its host-process authority.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: devops-junit-triage
  description: Parse JUnit issues and preserve failures, application errors, skips and unknown causes; infer infrastructure only from evidence.
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
    parse-junit:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - junit-triage
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - reportPath
        properties:
          reportPath:
            type: string
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - tests
          - testCases
          - failures
          - failedCount
          - issueCount
          - skippedCount
          - status
          - reportText
        properties:
          tests:
            type: integer
          testCases:
            type: array
          failures:
            type: array
          failedCount:
            type: integer
          issueCount:
            type: integer
          skippedCount:
            type: integer
          status:
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
      uses: action:parse-junit
      with:
        reportPath: '${{ inputs.reportPath }}'
    - id: report
      uses: action:write
      needs:
        - analyze
      with:
        path: artifacts/report.json
        content: '${{ tasks.analyze.output.reportText }}'
  inputs:
    reportPath: fixtures/junit.xml
  outputs:
    report: '${{ tasks.analyze.output }}'
```


## Expected result

The report contains `testCases`, `failures`, `failedCount`, `issueCount`, `skippedCount` and `status`. A case with multiple failure/error nodes yields multiple issue records. An empty suite returns `no-results`; it does not prove that tests passed.

Selected fields from the supplied fixture's `artifacts/report.json`:

```json
{
  "tests": 3,
  "failedCount": 2,
  "issueCount": 2,
  "skippedCount": 0,
  "status": "failures"
}
```

## Use your own data

Copy a real report into `fixtures` and pass `--input reportPath=fixtures/my-junit.xml`. Optional class names, test names and messages may be absent. Source references use a stable testcase/issue ordinal, so compare them with the original XML rather than assuming a line number.

Paths in these inputs stay inside the package's reviewed workspace. Use ordinary vars for non-secret configuration only. An input or variable does not grant authority to a new filesystem path, command or network destination.

## Failure and recovery

Malformed XML and a testcase marked both skipped and failed are rejected. A successful triage run can describe failed tests; use the report fields in a separate explicit CI gate instead of treating report generation as test success.

For a terminal successful run, reconstruct the recorded result without fresh effects:

```sh
agentctl replay RUN_ID --db state.db --output json --color never
```

For a failure, preserve the database and inspect task/effect status before choosing [resume, retry or repair](/agentctl/durable-execution/). A new run is a fresh invocation, not recovery of the old one.

## Authority and cleanup

The command uses the selected virtual environment's absolute interpreter path, while `processAllowlist` authorizes its basename. That generic Python grant trusts the reviewed helper; it does not pin one script or independently constrain its child processes. It is not an operating-system sandbox for every file access or child process made by Python. Only run the complete reviewed package on a trusted local machine or disposable runner. No production system is modified by this tutorial.

After saving needed reports and stopping this example's local service if present, remove only its disposable directory. The [optional acceptance suite](/agentctl/examples/devops/#contributor-verification) exercises additional denials, replay and failure injection; it is not required to run the published workflow.
