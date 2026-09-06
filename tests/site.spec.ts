import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes: ReadonlyArray<readonly [string, string]> = [
  ['/agentctl/', 'Control agent workflows'],
  ['/agentctl/getting-started/', 'Getting started'],
  ['/agentctl/guides/workflow-authoring/', 'Author workflows'],
  ['/agentctl/guides/variables/', 'Variables and instruction files'],
  ['/agentctl/examples/devops/', 'DevOps and CI/CD examples'],
  ['/agentctl/examples/', 'Cookbook'],
  ['/agentctl/reference/launch-limitation-review/', 'Validation and limitations'],
  ['/agentctl/concepts/framework-completeness/', 'Supported framework contract'],
  ['/agentctl/reference/limitation-burndown/', 'Boundary review records'],
  ['/agentctl/reference/completeness-verification/', 'Verification records'],
  ['/agentctl/reference/live-framework-verification/', 'Provider validation records'],
  ['/agentctl/guides/container/', 'Container guide'],
  ['/agentctl/durable-execution/', 'Durable execution'],
  ['/agentctl/troubleshooting/', 'Troubleshooting'],
  ['/agentctl/architecture/', 'Architecture overview'],
  ['/agentctl/contributing/', 'Contributing'],
];

test.describe('final artifact routes', () => {
  for (const [route, heading] of routes) {
    test(`${route} loads directly`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { name: heading, exact: false }).first()).toBeVisible();
      await expect(page.locator('body')).not.toContainText('Canonical source:');
      await expect(page.locator('body')).not.toContainText(/pre[ -]1\.0|launch[ -]ready candidate|agentctl\s+v?\d+\.\d+/i);
      const widths = await page.evaluate(() => ({
        content: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }));
      expect(widths.content, `${route} should fit the viewport`).toBeLessThanOrEqual(widths.viewport + 1);
      if (route === '/agentctl/guides/variables/') {
        const tables = page.locator('.sl-markdown-content table');
        for (const table of await tables.all()) {
          if (await table.evaluate((element) => element.scrollWidth > element.clientWidth)) {
            await expect(table).toHaveAttribute('tabindex', '0');
            await table.focus();
            await expect(table).toBeFocused();
            await page.keyboard.press('ArrowRight');
            await expect.poll(() => table.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
          }
        }
      }
      await page.reload();
      await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
    });
  }
});

test('homepage exposes clear calls to action and source truth', async ({ page }) => {
  await page.goto('/agentctl/');
  await expect(page.getByRole('link', { name: 'Get started', exact: true })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'View on GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/opensourceops/agentctl',
  );
  await expect(page.getByText('examples/acceptance/mock-tool/workflow.yaml')).toBeVisible();
  await expect(page.locator('footer.product-footer')).toContainText(/Docs verified against/);
});

test('homepage workflow copy control works', async ({ page }) => {
  await page.goto('/agentctl/');
  await page.getByRole('button', { name: 'Copy workflow YAML' }).click();
  await expect(page.getByRole('button', { name: 'Copy workflow YAML' })).toHaveText('Copied');
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain('apiVersion: agentctl.dev/v1');
});

test('navigation and sidebar reach important sections', async ({ page }) => {
  await page.goto('/agentctl/getting-started/');
  const menuButton = page.getByRole('button', { name: /menu/i });
  if (await menuButton.isVisible()) await menuButton.click();
  await expect(page.getByRole('link', { name: 'Provider overview', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'CLI reference', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Variables and instruction files', exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'DevOps cookbook and packages', exact: true })).toBeVisible();
  const sidebar = page.locator('#starlight__sidebar');
  const text = (await sidebar.textContent()) ?? '';
  expect(text.indexOf('Install agentctl')).toBeLessThan(text.indexOf('Supported framework contract'));
  await expect(page.getByRole('link', { name: 'What agentctl solves', exact: true })).not.toContainText('v1');
});

test('Mermaid diagrams render without client errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/agentctl/architecture/diagrams/');
  await expect(page.locator('pre.mermaid svg')).toHaveCount(15, { timeout: 20_000 });
  await expect(page.locator('.error-icon')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('404 offers useful recovery links', async ({ page }) => {
  const response = await page.goto('/agentctl/not-a-real-page/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /not here|not found/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Getting started/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /CLI reference/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Troubleshooting/i })).toBeVisible();
});

test('representative pages have no serious automated accessibility violations', async ({ page }) => {
  for (const route of ['/agentctl/', '/agentctl/getting-started/', '/agentctl/guides/container/', '/agentctl/troubleshooting/', '/agentctl/guides/variables/', '/agentctl/examples/devops/']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const serious = results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''));
    expect(serious, `${route}: ${serious.map((item) => item.id).join(', ')}`).toEqual([]);
  }
});

test.describe('desktop and tablet search', () => {
  test('representative search terms return results', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Search query matrix runs on desktop and tablet only.');
    test.setTimeout(90_000);
    await page.goto('/agentctl/');
    const searchButton = page.getByRole('button', { name: /search/i }).first();
    const queries = ['replay', 'OPENAI_API_KEY', 'approval', 'container', 'exit code', 'database locked', 'MCP', 'Gemini', 'varsFiles', 'DevOps'];
    for (const query of queries) {
      await searchButton.click();
      const dialog = page.getByRole('dialog');
      const input = dialog.getByRole('textbox', { name: 'Search' });
      await input.fill(query);
      await expect(dialog.locator('a').filter({ hasText: /./ }).first()).toBeVisible({ timeout: 10_000 });
      await page.keyboard.press('Escape');
    }
  });
});

const cookbook: ReadonlyArray<readonly [string, string]> = [
  ['01-ci-diagnosis', 'Diagnose a failed CI build'],
  ['02-junit-triage', 'Triage JUnit test results'],
  ['03-pipeline-review', 'Review a GitHub Actions pipeline'],
  ['04-dockerfile-review', 'Review a Dockerfile'],
  ['05-kubernetes-review', 'Validate Kubernetes manifests'],
  ['06-terraform-plan', 'Review a Terraform plan'],
  ['07-dependency-update', 'Validate a vendored-code patch'],
  ['08-sbom-triage', 'Triage an SBOM and vulnerability report'],
  ['09-release-notes', 'Generate evidenced release notes'],
  ['10-release-readiness', 'Evaluate and enforce release readiness'],
  ['11-configuration-drift', 'Explain configuration drift'],
  ['12-incident-timeline', 'Build an incident timeline'],
  ['13-canary-evaluation', 'Evaluate a canary'],
  ['14-local-deployment', 'Approve a disposable local deployment'],
  ['15-interrupted-deployment', 'Recover an interrupted deployment'],
  ['16-retry-repair', 'Retry and selectively repair a workflow'],
  ['17-compensated-rollout', 'Compensate a failed local rollout'],
  ['18-parallel-matrix', 'Run bounded checks across services'],
  ['19-role-subworkflow', 'Review a proposed change with bounded roles'],
  ['20-bounded-remediation', 'Run a bounded remediation loop'],
];

for (const [directory, heading] of cookbook) {
  test(`cookbook ${directory}: direct commands, YAML, assets, and accessibility`, async ({ page, request }) => {
    await page.goto(`/agentctl/examples/devops/${directory}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    const content = page.locator('.sl-markdown-content');
    await expect(content).toContainText('agentctl check local.workflow.yaml');
    await expect(content).toContainText('agentctl plan local.workflow.yaml');
    await expect(content).toContainText('agentctl inspect');
    await expect(content).toContainText('apiVersion: agentctl.dev/v1');
    await expect(content).not.toContainText('blob/main/');
    const workflowBlock = content.locator('.expressive-code').filter({ hasText: 'apiVersion: agentctl.dev/v1' });
    await expect(workflowBlock).toHaveCount(1);
    const renderedLines = await workflowBlock.locator('pre .ec-line > .code').allTextContents();
    await workflowBlock.locator('.copy button').click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied.trimEnd()).toBe(renderedLines.join('\n').trimEnd());
    expect(copied).toContain('kind: Workflow');
    expect(copied).toContain('  tasks:');
    expect(copied).toContain('  policy:');
    const archive = content.getByRole('link', { name: 'Download all files', exact: true });
    await expect(archive).toHaveAttribute('href', `/agentctl/downloads/devops/${directory}.zip`);
    const response = await request.get(`/agentctl/downloads/devops/${directory}.zip`);
    expect(response.ok()).toBe(true);
    expect((await response.body()).subarray(0, 2).toString()).toBe('PK');
    const widths = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(widths[0]).toBeLessThanOrEqual(widths[1] + 1);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  });
}

test('every cookbook tutorial has a searchable entry', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/agentctl/examples/');
  for (const [directory, heading] of cookbook) {
    await page.getByRole('button', { name: /search/i }).first().click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('textbox', { name: 'Search' }).fill(heading);
    await expect(dialog.locator(`a[href*="/examples/devops/${directory}/"]`).first()).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press('Escape');
  }
});

test('installed-binary quickstart contains copyable complete YAML', async ({ page }) => {
  await page.goto('/agentctl/getting-started/');
  const block = page.locator('.expressive-code').filter({ hasText: 'apiVersion: agentctl.dev/v1' });
  await expect(block).toHaveCount(1);
  await block.locator('.copy button').click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('kind: Workflow');
  expect(copied).toContain('kind: builtin.assign');
  expect(copied).not.toContain('cp examples/');
});

test('container quickstart exposes complete readable configuration', async ({ page }) => {
  await page.goto('/agentctl/guides/container/');
  const block = page.locator('.expressive-code').filter({ hasText: 'name: container-greeting' });
  await expect(block).toHaveCount(1);
  await block.locator('.copy button').click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('apiVersion: agentctl.dev/v1');
  expect(copied).toContain('varsFiles: [defaults.yaml]');
  expect(copied).toContain('writableRoots: [/artifacts]');
  await expect(page.locator('.sl-markdown-content')).toContainText('--entrypoint /bin/sh');
  await expect(page.locator('.sl-markdown-content')).toContainText('Harness coverage is vendor syntax review');
});

test('independent remediation tutorial offers a complete searchable download', async ({ page, request }) => {
  const route = '/agentctl/examples/devops/21-container-remediation/';
  await page.goto(route);
  await expect(page.getByRole('heading', { name: 'Remediate a container vulnerability', exact: true })).toBeVisible();
  const archive = page.locator('.sl-markdown-content').getByRole('link', { name: 'Download all files', exact: true });
  const download = '/agentctl/downloads/remediation/21-container-remediation.zip';
  await expect(archive).toHaveAttribute('href', download);
  const response = await request.get(download);
  expect(response.ok()).toBe(true);
  expect((await response.body()).subarray(0, 2).toString()).toBe('PK');
  const widths = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  expect(widths[0]).toBeLessThanOrEqual(widths[1] + 1);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  await page.getByRole('button', { name: /search/i }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: 'Search' }).fill('Remediate a container vulnerability');
  await expect(dialog.locator(`a[href*="${route}"]`).first()).toBeVisible({ timeout: 10_000 });
});
