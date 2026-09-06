---
title: "Triage an SBOM and vulnerability report"
description: "Evaluate severity and scoped exceptions, then optionally enforce a CI gate."
editUrl: "https://github.com/opensourceops/agentctl/edit/30167c8330b1a3fb0bb89c2426d6310e1efd6aa4/examples/devops/08-sbom-triage/README.md"
---
> **Candidate example package:** [Download all files](/agentctl/downloads/devops/08-sbom-triage.zip). Built from source [`30167c8330b1`](https://github.com/opensourceops/agentctl/tree/30167c8330b1a3fb0bb89c2426d6310e1efd6aa4/examples/devops/08-sbom-triage). It includes the helper and setup step used below; download the complete package before editing a workflow.

**For:** Security practitioner. **Level and evidence:** Intermediate; offline, no model or live vulnerability database.

Join vulnerability findings to SBOM components and apply explicit severity and time-bounded exception rules.

## Get the complete example

Install the [matching candidate binary](/agentctl/getting-started/installation/). Download this tutorial's complete package from the documentation site and extract it into an empty directory. When working from the source checkout, create the same package with:

```sh
python3 examples/devops/package.py --example 08 --output ./example-08
```

Enter the extracted directory containing `setup.py`. You need Python 3.11 or newer. Create an isolated environment and install the pinned example dependencies:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup.py
```

On Windows, use `.venv\Scripts\python.exe` in place of `.venv/bin/python`. Setup records the selected interpreters and prepares `local.workflow.yaml` with a matching explicit interpreter-basename grant. Review that generated workflow before running it. The authored [workflow.yaml](https://github.com/opensourceops/agentctl/blob/30167c8330b1a3fb0bb89c2426d6310e1efd6aa4/examples/devops/08-sbom-triage/workflow.yaml) remains readable and editable source.

The complete package contains:

```text
08-sbom-triage/
  README.md
  example.json
  fixtures/rules.json
  fixtures/sbom.json
  fixtures/vulnerabilities.json
  format_operations.py
  gate.workflow.yaml
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

Each vulnerability and exception is scoped by vulnerability ID and component identity. Exceptions need an approved status, owner, reason and expiry. Revoked, expired or wrong-component exceptions do not authorize a finding. Unknown severity is handled conservatively.

[Open the complete workflow](https://github.com/opensourceops/agentctl/blob/30167c8330b1a3fb0bb89c2426d6310e1efd6aa4/examples/devops/08-sbom-triage/workflow.yaml) to inspect its inputs, task dependencies, grants and bounds. The site embeds the same source below; editing a helper does not replace review of its host-process authority.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: devops-sbom-triage
  description: Join CycloneDX component identities to vulnerabilities and enforce severity and expiring exception rules.
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
    triage-sbom:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - sbom-triage
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - sbomPath
          - vulnerabilitiesPath
          - rulesPath
        properties:
          sbomPath:
            type: string
          vulnerabilitiesPath:
            type: string
          rulesPath:
            type: string
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - findings
          - decision
          - asOf
          - mode
          - requiresExplicitCiGate
          - reportText
        properties:
          findings:
            type: array
          decision:
            type: string
          asOf:
            type: string
          mode:
            type: string
          requiresExplicitCiGate:
            type: boolean
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
      uses: action:triage-sbom
      with:
        sbomPath: '${{ inputs.sbomPath }}'
        vulnerabilitiesPath: '${{ inputs.vulnerabilitiesPath }}'
        rulesPath: '${{ inputs.rulesPath }}'
    - id: report
      uses: action:write
      needs:
        - analyze
      with:
        path: artifacts/report.json
        content: '${{ tasks.analyze.output.reportText }}'
  inputs:
    sbomPath: fixtures/sbom.json
    vulnerabilitiesPath: fixtures/vulnerabilities.json
    rulesPath: fixtures/rules.json
  outputs:
    report: '${{ tasks.analyze.output }}'
```


## Expected result

`artifacts/report.json` records each disposition and `decision: go` or `no-go`. Report-only mode exits successfully even when a finding blocks release. Use the explicit CI gate path to fail nonzero and prevent the downstream release artifact.

## Enforce the decision in CI

Setup also prepares `local.gate.workflow.yaml`. Inspect its `report` → gate assertion → downstream marker dependency before using it:

```sh
agentctl check local.gate.workflow.yaml --workspace .
agentctl plan local.gate.workflow.yaml --workspace .
agentctl run local.gate.workflow.yaml --workspace . --db gate.db --output json
```

For the supplied no-go fixture in a fresh package, expect a nonzero exit and no downstream release marker. If reusing a workspace, do not mistake an older run's marker for permission from the current gate. The report remains inspectable. With valid passing input data, the assertion permits the marker. Keep this local marker as a demonstration until you replace it with a separately reviewed release action and explicit authority.

Selected fields from the supplied fixture's `artifacts/report.json`:

```json
{
  "asOf": "2026-09-05",
  "decision": "no-go",
  "mode": "analysis-only",
  "requiresExplicitCiGate": true
}
```

## Use your own data

Pass `--input sbomPath=fixtures/my-sbom.json`, `--input vulnerabilitiesPath=fixtures/my-findings.json` and `--input rulesPath=fixtures/my-rules.json`. Keep `asOf` explicit so results are reproducible; refresh it when evaluating a new release.

Paths in these inputs stay inside the package's reviewed workspace. Use ordinary vars for non-secret configuration only. An input or variable does not grant authority to a new filesystem path, command or network destination.

## Failure and recovery

Invalid dates, unknown component references, duplicate scopes and malformed severity rules are rejected. Test expired, revoked and mismatched exceptions. A report only analyzes the supplied database snapshot; it does not establish current vulnerability coverage.

For a terminal successful run, reconstruct the recorded result without fresh effects:

```sh
agentctl replay RUN_ID --db state.db --output json --color never
```

For a failure, preserve the database and inspect task/effect status before choosing [resume, retry or repair](/agentctl/durable-execution/). A new run is a fresh invocation, not recovery of the old one.

## Authority and cleanup

The command uses the selected virtual environment's absolute interpreter path, while `processAllowlist` authorizes its basename. That generic Python grant trusts the reviewed helper; it does not pin one script or independently constrain its child processes. It is not an operating-system sandbox for every file access or child process made by Python. Only run the complete reviewed package on a trusted local machine or disposable runner. No production system is modified by this tutorial.

After saving needed reports and stopping this example's local service if present, remove only its disposable directory. The [optional acceptance suite](/agentctl/examples/devops/#contributor-verification) exercises additional denials, replay and failure injection; it is not required to run the published workflow.
