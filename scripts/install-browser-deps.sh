#!/usr/bin/env bash
set -euo pipefail

# This CI helper targets the workflow's pinned Ubuntu 24.04 runner.
source /etc/os-release
if [[ "$ID" != ubuntu || "$VERSION_ID" != 24.04 ]]; then
  echo 'Browser dependency isolation requires Ubuntu 24.04.' >&2
  exit 1
fi
test -s /etc/apt/sources.list.d/ubuntu.sources

node_bin="$(command -v node)"
playwright_cli="$(node -p 'require.resolve("@playwright/test/cli")')"
apt_work="$(mktemp -d /tmp/agentctl-playwright-apt.XXXXXX)"
trap 'sudo rm -rf -- "$apt_work"' EXIT
chmod 755 "$apt_work"
mkdir "$apt_work/empty" "$apt_work/lists"

# Preserve Ubuntu's configured mirrors and Signed-By keyring. Scope both source
# discovery and cached indexes to this invocation; never rewrite host sources.
cat > "$apt_work/apt.conf" <<EOF
Dir::Etc::sourcelist "/etc/apt/sources.list.d/ubuntu.sources";
Dir::Etc::sourceparts "$apt_work/empty";
Dir::State::lists "$apt_work/lists";
APT::Update::Error-Mode "any";
EOF

# Playwright's own sudo transition drops APT_CONFIG. Start its pinned CLI as
# root explicitly so the configuration reaches both apt-get update and install.
sudo env APT_CONFIG="$apt_work/apt.conf" "$node_bin" "$playwright_cli" install-deps chromium
