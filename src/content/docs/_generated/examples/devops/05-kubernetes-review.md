---
title: "Validate Kubernetes manifests"
description: "Review local manifests and validate a pinned schema without a cluster."
editUrl: "https://github.com/opensourceops/agentctl/edit/ed604369fb73a3d1bba65d8a2026927f59b14e97/examples/devops/05-kubernetes-review/README.md"
---
> **Complete example package:** [Download all files](/agentctl/downloads/devops/05-kubernetes-review.zip). Built from source [`ed604369fb73`](https://github.com/opensourceops/agentctl/tree/ed604369fb73a3d1bba65d8a2026927f59b14e97/examples/devops/05-kubernetes-review). It includes the helper and setup step used below; download the complete package before editing a workflow.

**For:** Platform engineer. **Level and evidence:** Intermediate; offline, Python and the bundled pinned schema.

Review a Deployment locally and validate the proposed manifest without contacting a Kubernetes cluster.

## Get the complete example

Install the [matching agentctl binary](/agentctl/getting-started/installation/). Download this tutorial's complete package from the documentation site and extract it into an empty directory. When working from the source checkout, create the same package with:

```sh
python3 examples/devops/package.py --example 05 --output ./example-05
```

Enter the extracted directory containing `setup.py`. You need Python 3.11 or newer. Create an isolated environment and install the pinned example dependencies:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup.py
```

On Windows, use `.venv\Scripts\python.exe` in place of `.venv/bin/python`. Setup records the selected interpreters and prepares `local.workflow.yaml` with a matching explicit interpreter-basename grant. Review that generated workflow before running it. The authored [workflow.yaml](https://github.com/opensourceops/agentctl/blob/ed604369fb73a3d1bba65d8a2026927f59b14e97/examples/devops/05-kubernetes-review/workflow.yaml) remains readable and editable source.

The complete package contains:

```text
05-kubernetes-review/
  README.md
  example.json
  fixtures/KUBERNETES-LICENSE
  fixtures/deployment-v1.35.0.provenance.json
  fixtures/deployment-v1.35.0.schema.json
  fixtures/deployment.yaml
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

The workflow inspects security-sensitive settings, proposes a narrow local change, and validates the resulting object. The full-schema path uses the bundled Kubernetes v1.35.0 Deployment schema, including its 120 referenced definitions, and preserves unrelated fields. Its recorded transformation handles Kubernetes IntOrString values; it does not implement CEL, server defaulting, admission policy or image validation. Keep the schema, provenance and license files together.

[Open the complete workflow](https://github.com/opensourceops/agentctl/blob/ed604369fb73a3d1bba65d8a2026927f59b14e97/examples/devops/05-kubernetes-review/workflow.yaml) to inspect its inputs, task dependencies, grants and bounds. The site embeds the same source below; editing a helper does not replace review of its host-process authority.


```yaml
apiVersion: agentctl.dev/v1
kind: Workflow
metadata:
  name: devops-kubernetes-review
  description: Repair fixture replica typing and non-root security settings; validate known fields against a pinned full Deployment schema without a cluster.
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
    propose-deployment:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - kubernetes-propose
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
    validate-deployment:
      kind: extension.process
      command: python3
      args:
        - helper.py
        - kubernetes-validate
      idempotency: idempotent
      protocolVersion: agentctl.dev/process-extension/v1
      inputSchema:
        type: object
        additionalProperties: false
        required:
          - sourcePath
          - proposalPath
          - schemaPath
        properties:
          sourcePath:
            type: string
          proposalPath:
            type: string
          schemaPath:
            type: string
      outputSchema:
        type: object
        additionalProperties: false
        required:
          - manifest
          - violations
          - schemaScope
          - schemaSha256
          - validated
          - reportText
        properties:
          manifest:
            type: object
          violations:
            type: array
          schemaScope:
            type: string
          schemaSha256:
            type: string
          validated:
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
    - id: propose
      uses: action:propose-deployment
      with:
        sourcePath: '${{ inputs.sourcePath }}'
    - id: analyze
      uses: action:validate-deployment
      needs:
        - propose
      with:
        sourcePath: '${{ inputs.sourcePath }}'
        proposalPath: '${{ tasks.propose.output.proposalPath }}'
        schemaPath: '${{ inputs.schemaPath }}'
    - id: report
      uses: action:write
      needs:
        - analyze
      with:
        path: artifacts/report.json
        content: '${{ tasks.analyze.output.reportText }}'
  inputs:
    sourcePath: fixtures/deployment.yaml
    schemaPath: fixtures/deployment-v1.35.0.schema.json
  outputs:
    report: '${{ tasks.analyze.output }}'
```


## Expected result

Inspect the proposed manifest and report in `artifacts`. Schema validation establishes document shape for the pinned API version. It cannot establish cluster admission policy, resource availability or a healthy rollout.

Selected fields from the supplied fixture's `artifacts/report.json`:

```json
{
  "schemaScope": "all 120 referenced upstream Kubernetes v1.35.0 Deployment definitions; IntOrString translated to JSON Schema; no cluster admission, CEL, server defaulting or image validation",
  "schemaSha256": "7ecfcb16d4e530e985608d4b1e0ad08e802f15f8a4004ab47ec86d3f64ef42fb",
  "validated": true
}
```

## Use your own data

Use a real manifest for the same Kubernetes API version. Keep environment values, labels, annotations, resource limits and unrelated security settings when reviewing the proposed change. Update the schema pin deliberately when targeting another version.

Paths in these inputs stay inside the package's reviewed workspace. Use ordinary vars for non-secret configuration only. An input or variable does not grant authority to a new filesystem path, command or network destination.

## Failure and recovery

Incompatible known-field types or a failed full-schema check stop validation. The upstream schema generally preserves unknown fields; it is not a universal unknown-field rejection or cluster-conformance check. Cluster-side dry-run or admission validation is a separate integration requiring explicit access; this tutorial makes no cluster request.

For a terminal successful run, reconstruct the recorded result without fresh effects:

```sh
agentctl replay RUN_ID --db state.db --output json --color never
```

For a failure, preserve the database and inspect task/effect status before choosing [resume, retry or repair](/agentctl/durable-execution/). A new run is a fresh invocation, not recovery of the old one.

## Authority and cleanup

The command uses the selected virtual environment's absolute interpreter path, while `processAllowlist` authorizes its basename. That generic Python grant trusts the reviewed helper; it does not pin one script or independently constrain its child processes. It is not an operating-system sandbox for every file access or child process made by Python. Only run the complete reviewed package on a trusted local machine or disposable runner. No production system is modified by this tutorial.

After saving needed reports and stopping this example's local service if present, remove only its disposable directory. The [optional acceptance suite](/agentctl/examples/devops/#contributor-verification) exercises additional denials, replay and failure injection; it is not required to run the published workflow.
