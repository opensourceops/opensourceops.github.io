import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

const github = 'https://github.com/opensourceops/agentctl';

export default defineConfig({
  site: 'https://opensourceops.github.io',
  base: '/agentctl/',
  outDir: './dist-agentctl',
  integrations: [
    mermaid({
      autoTheme: true,
      enableLog: false,
      mermaidConfig: {
        securityLevel: 'strict',
        flowchart: { curve: 'linear', htmlLabels: false },
      },
    }),
    starlight({
      title: 'agentctl',
      description:
        'Declarative workflows for deterministic automation and bounded agent reasoning, with explicit policy and durable local state.',
      tagline: 'Deterministic workflows. Bounded agents. Durable evidence.',
      favicon: '/favicon.png',
      social: [{ icon: 'github', label: 'agentctl on GitHub', href: github }],
      editLink: { baseUrl: `${github}/edit/main/` },
      lastUpdated: false,
      pagination: true,
      pagefind: true,
      credits: false,
      customCss: ['./src/styles/custom.css'],
      components: {
        Header: './src/components/Header.astro',
        Footer: './src/components/Footer.astro',
      },
      head: [
        { tag: 'meta', attrs: { name: 'theme-color', content: '#0f766e' } },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'agentctl documentation' } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://opensourceops.github.io/agentctl/og.png' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://opensourceops.github.io/agentctl/og.png' } },
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          content: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'agentctl documentation',
            url: 'https://opensourceops.github.io/agentctl/',
          }),
        },
      ],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { slug: 'overview', label: 'Overview', badge: 'v1alpha1' },
            { slug: 'why-agentctl', label: 'Why agentctl' },
            { slug: 'concepts/product', label: 'Product definition' },
            { slug: 'concepts/framework-completeness', label: 'Framework completeness' },
            { slug: 'getting-started/installation', label: 'Installation' },
            { slug: 'getting-started', label: 'Getting started' },
            { slug: 'getting-started/first-agent', label: 'First agent workflow' },
            { slug: 'learning-paths', label: 'Learning paths' },
            { slug: 'deployment-model', label: 'Choose a deployment model' },
          ],
        },
        {
          label: 'Learn the workflow model',
          items: [
            { slug: 'concepts/workflow-model', label: 'Workflow document' },
            { slug: 'guides/workflow-authoring', label: 'Author workflows' },
            { slug: 'concepts/tools', label: 'Actions, tools, and effects' },
            { slug: 'concepts/policies', label: 'Policies and approvals' },
            { slug: 'concepts/memory', label: 'Memory' },
            { slug: 'concepts/packs', label: 'Packs' },
          ],
        },
        {
          label: 'Run workflows',
          items: [
            { slug: 'guides/local-operation', label: 'Local operation' },
            { slug: 'durable-execution', label: 'Resume, replay, retry, and fork' },
            { slug: 'guides/selective-repair', label: 'Repair a failed workflow' },
            { slug: 'operations/scheduled', label: 'Scheduled execution' },
          ],
        },
        {
          label: 'Operate agentctl',
          items: [
            { slug: 'guides/container', label: 'Container' },
            { slug: 'guides/ci-cd', label: 'CI/CD and Kubernetes' },
            { slug: 'observability', label: 'Logs and observability' },
            { slug: 'reference/database', label: 'State, locking, and retention' },
          ],
        },
        {
          label: 'Providers and protocols',
          items: [
            { slug: 'providers', label: 'Provider overview' },
            { slug: 'reference/capabilities', label: 'Capability matrices' },
            { slug: 'providers/mcp', label: 'MCP' },
            { slug: 'providers/a2a', label: 'A2A' },
            { slug: 'reference/environment', label: 'Authentication and environment' },
          ],
        },
        {
          label: 'Security',
          items: [
            { slug: 'security', label: 'Security model' },
            { slug: 'security/threat-model', label: 'Threat model' },
            { slug: 'concepts/policies', label: 'Filesystem, process, and network policy' },
            { slug: 'reference/limitations', label: 'Known limitations' },
          ],
        },
        {
          label: 'Examples and use cases',
          items: [
            { slug: 'examples', label: 'Examples overview' },
            { slug: 'examples/repository-audit', label: 'Repository audit' },
            { slug: 'examples/release-readiness', label: 'Release readiness' },
            { slug: 'examples/scheduled-review', label: 'Scheduled review' },
            { slug: 'examples/ci-quality-gate', label: 'CI quality gate' },
            { slug: 'examples/approval-gated', label: 'Approval-gated action' },
            { slug: 'examples/recorded-replay', label: 'Recorded replay' },
            { slug: 'guides/selective-repair', label: 'Selective workflow repair' },
            { slug: 'examples/provider-portability', label: 'Provider portability' },
          ],
        },
        {
          label: 'Troubleshooting',
          items: [{ slug: 'troubleshooting', label: 'Problem-solving guide' }],
        },
        {
          label: 'Reference',
          items: [
            { slug: 'reference/cli', label: 'CLI reference' },
            { slug: 'reference/yaml', label: 'YAML reference' },
            { slug: 'reference/output', label: 'Output and exit codes' },
            { slug: 'reference/environment', label: 'Environment and default paths' },
            { slug: 'reference/capabilities', label: 'Provider and tool matrices' },
            { slug: 'reference/database', label: 'Database and migrations' },
            { slug: 'reference/terminology', label: 'Terminology' },
            { slug: 'reference/compatibility', label: 'Compatibility' },
            { slug: 'reference/migration', label: 'Migrate from TypeScript' },
            { slug: 'reference/limitations', label: 'Limitations' },
            { slug: 'reference/limitation-burndown', label: 'Limitation burn-down' },
            { slug: 'reference/completeness-verification', label: 'Completeness verification' },
            { slug: 'reference/live-framework-verification', label: 'Live framework verification' },
          ],
        },
        {
          label: 'Architecture',
          items: [
            { slug: 'architecture', label: 'Architecture overview' },
            { slug: 'architecture/diagrams', label: 'Architecture diagrams' },
            {
              label: 'Design decisions',
              items: ['architecture/decisions/0001', 'architecture/decisions/0002', 'architecture/decisions/0003', 'architecture/decisions/0004', 'architecture/decisions/0005', 'architecture/decisions/0006', 'architecture/decisions/0007'],
            },
          ],
        },
        {
          label: 'Contributing',
          items: [
            { slug: 'contributing', label: 'Contributor guide' },
            { slug: 'contributing/developer-guide', label: 'Developer guide' },
            { slug: 'contributing/testing', label: 'Build and test' },
            { slug: 'contributing/add-action', label: 'Add an action or tool' },
            { slug: 'contributing/add-provider', label: 'Add a provider' },
            { slug: 'contributing/add-migration', label: 'Add a migration' },
            { slug: 'contributing/documentation', label: 'Write documentation' },
            { slug: 'contributing/release', label: 'Release process' },
          ],
        },
      ],
    }),
  ],
});
