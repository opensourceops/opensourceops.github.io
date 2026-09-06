#!/usr/bin/env python3
"""Verify the independent remediation download in the final site artifact."""
import hashlib
import json
from pathlib import Path, PurePosixPath
import posixpath
import re
import stat
from urllib.parse import unquote, urlsplit
import zipfile

root = Path(__file__).resolve().parent.parent / "_site/agentctl"
source = json.loads((root / "meta/agentctl-source.json").read_text())
catalog = json.loads((root / "downloads/remediation/catalog.json").read_text())
assert len(catalog) == 1, "expected one independent remediation package"
item = catalog[0]
assert item == source["remediationPackage"], "remediation catalog differs from source metadata"
assert item["directory"] == "21-container-remediation"
archive = root / "downloads/remediation/21-container-remediation.zip"
assert hashlib.sha256(archive.read_bytes()).hexdigest() == item["sha256"]
required = {
    "README.md", "Dockerfile", "app.py", "requirements.in", "requirements.lock",
    "tests/test_app.py", "agentctl/remediate.yaml", "agentctl/eligibility.yaml", "agentctl/preflight.yaml",
    "agentctl/instructions/analyze.md", "agentctl/instructions/implement.md",
    "remediation/adapter.py", "remediation/runner.py", "remediation/publisher.py", "remediation/preflight.py",
    "remediation/export.py", "remediation/bootstrap.py", "remediation/bootstrap.json",
    "remediation/requirements-tools.txt", ".github/workflows/remediation.yml",
    "package-manifest.json",
}
with zipfile.ZipFile(archive) as zipped:
    names = zipped.namelist()
    assert len(names) == len(set(names)), "duplicate archive member"
    assert all(not PurePosixPath(name).is_absolute()
               and ".." not in PurePosixPath(name).parts and "\\" not in name for name in names), "unsafe archive path"
    assert all(stat.S_ISREG(info.external_attr >> 16) for info in zipped.infolist()), "nonregular archive member"
    prefix = "21-container-remediation/"
    assert all(name.startswith(prefix) for name in names), "wrong archive root"
    relative = {name.removeprefix(prefix) for name in names}
    assert required <= relative, f"incomplete remediation package: {required - relative}"
    manifest = json.loads(zipped.read(prefix + "package-manifest.json"))
    assert manifest["frameworkSourceSha"] == source["commit"] == item["sourceCommit"]
    assert manifest["frameworkPackagePath"] == "examples/devops/21-container-remediation"
    assert isinstance(manifest["sourceDirty"], bool), "missing package dirty-source status"
    # Package status is narrower than the complete framework worktree status.
    assert source["dirty"] or manifest["sourceDirty"] is False, "clean site includes dirty package bytes"
    assert set(manifest["files"]) == relative - {"package-manifest.json"}, "unmanifested asset"
    for name, digest in manifest["files"].items():
        assert hashlib.sha256(zipped.read(prefix + name)).hexdigest() == digest, name
    bootstrap = json.loads(zipped.read(prefix + "remediation/bootstrap.json"))
    assert bootstrap["frameworkRepository"] == "opensourceops/agentctl"
    assert bootstrap["allowedFrameworkShas"] == [source["commit"]]
    assert bootstrap["repository"] == "Ompragash/agentctl-remediation-demo"
    assert bootstrap["toolingRegistry"] == "docker.io/opensourceops/agentctl"
    for name in ["agentctl/remediate.yaml", "agentctl/eligibility.yaml", "agentctl/preflight.yaml"]:
        workflow = zipped.read(prefix + name).decode("utf-8")
        assert "apiVersion: agentctl.dev/v1\n" in workflow and not workflow.lstrip().startswith("{"), name
    tutorial = zipped.read(prefix + "README.md").decode("utf-8")
    for target in re.findall(r"(?<!!)\[[^]]+\]\(([^)\s]+)\)", tutorial):
        parsed = urlsplit(target)
        if parsed.scheme or parsed.netloc or not parsed.path:
            continue
        linked_file = posixpath.normpath(unquote(parsed.path))
        assert linked_file in relative, f"broken standalone README link: {target}"
print("Independent remediation ZIP is complete, path-safe, source-bound and digest-verified.")
