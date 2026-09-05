import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes: ReadonlyArray<readonly [string, string]> = [
  ['/agentctl/', 'Control agent workflows'],
  ['/agentctl/getting-started/', 'Getting started'],
  ['/agentctl/guides/workflow-authoring/', 'Author workflows'],
  ['/agentctl/guides/variables/', 'Variables and instruction files'],
  ['/agentctl/examples/devops/', 'DevOps and CI/CD examples'],
  ['/agentctl/reference/launch-limitation-review/', 'Current launch limitation review'],
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
  await expect(page.getByRole('link', { name: 'DevOps and CI/CD suite', exact: true })).toBeVisible();
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
