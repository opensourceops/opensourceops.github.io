#!/usr/bin/env python3
"""Verify complete source-matched cookbook ZIP bytes in the final site artifact."""
import hashlib
import json
import posixpath
import re
from pathlib import Path, PurePosixPath
import zipfile
from urllib.parse import unquote, urlsplit


root = Path(__file__).resolve().parent.parent / "_site/agentctl"
source = json.loads((root / "meta/agentctl-source.json").read_text())
catalog = json.loads((root / "downloads/devops/catalog.json").read_text())
assert len(catalog) == 20, "expected all twenty cookbook packages"
required = {"README.md", "workflow.yaml", "helper.py", "setup.py", "yaml_io.py",
            "requirements.txt", "operations.py", "format_operations.py", "local_service.py", "service_operations.py", "example.json"}
for item in catalog:
    archive = root / "downloads/devops" / (item["directory"] + ".zip")
    assert hashlib.sha256(archive.read_bytes()).hexdigest() == item["sha256"], archive
    with zipfile.ZipFile(archive) as zipped:
        names = zipped.namelist()
        assert len(names) == len(set(names)), f"duplicate ZIP members: {archive}"
        assert all(not PurePosixPath(name).is_absolute() and ".." not in PurePosixPath(name).parts
                   and "\\" not in name for name in names), f"unsafe ZIP paths: {archive}"
        prefix = item["directory"] + "/"
        assert all(name.startswith(prefix) for name in names), f"wrong package root: {archive}"
        relative = {name.removeprefix(prefix) for name in names}
        assert required <= relative, f"incomplete package {archive}: {required - relative}"
        manifest = json.loads(zipped.read(prefix + "example.json"))
        assert manifest["sourceSha"] == source["commit"] == item["sourceCommit"], archive
        assert manifest["sourceWorktreeDirty"] == source["dirty"], archive
        assert set(manifest["files"]) == relative - {"example.json"}, f"unmanifested asset: {archive}"
        for name, digest in manifest["files"].items():
            assert hashlib.sha256(zipped.read(prefix + name)).hexdigest() == digest, (archive, name)
        workflow = zipped.read(prefix + "workflow.yaml").decode("utf-8")
        assert not workflow.lstrip().startswith("{") and "apiVersion: agentctl.dev/v1\n" in workflow, f"non-readable YAML: {archive}"
        tutorial = zipped.read(prefix + "README.md").decode("utf-8")
        for target in re.findall(r"(?<!!)\[[^]]+\]\(([^)\s]+)\)", tutorial):
            parsed = urlsplit(target)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            linked_file = posixpath.normpath(unquote(parsed.path))
            assert linked_file in relative, f"broken standalone README link {target}: {archive}"
        for command in ["agentctl check local.workflow.yaml", "agentctl plan local.workflow.yaml", "agentctl inspect"]:
            assert command in tutorial, f"missing direct command {command}: {archive}"
print("All twenty ZIPs have complete, safe paths and source-matched, digest-verified workflow assets.")
