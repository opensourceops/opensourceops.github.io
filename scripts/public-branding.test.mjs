import assert from 'node:assert/strict';
import test from 'node:test';
import { publicBrandingIssues, visibleHtmlText } from './public-branding.mjs';

test('rejects the retired public product labels and registry placeholder', () => {
  for (const phrase of ['pre-1.0', 'pre 1.0', 'launch-ready candidate', 'agentctl 0.4.0', 'agentctl:0.4.0', 'ghcr.io/OWNER/agentctl']) {
    assert.ok(publicBrandingIssues(phrase).length, phrase);
  }
});

test('preserves functional APIs, dependency pins, digests and fixture release refs', () => {
  for (const phrase of ['apiVersion: agentctl.dev/v1', 'agentctl.dev/pack/v1alpha1', 'MCP 2025-11-25', 'Python 3.11', 'cargo-cyclonedx --version 0.5.9', 'fixture refs v0.2.0 and v0.3.0', 'docker.io/opensourceops/agentctl@sha256:abcdef', 'agentctl:latest']) {
    assert.deepEqual(publicBrandingIssues(phrase), [], phrase);
  }
});

test('checks visible version branding without erasing machine metadata', () => {
  const html = '<script type="application/json">{"name":"agentctl 0.4.0"}</script><footer><strong>agentctl</strong> 0.4.0</footer>';
  assert.deepEqual(publicBrandingIssues(visibleHtmlText(html)), ['agentctl release branding']);
  assert.deepEqual(publicBrandingIssues(visibleHtmlText('<script>{"name":"agentctl 0.4.0"}</script><h1>agentctl</h1>')), []);
});
