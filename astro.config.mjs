import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { satteri } from '@astrojs/markdown-satteri';
import focusableTables from './scripts/focusable-tables.mjs';

const github = 'https://github.com/opensourceops/agentctl';

export default defineConfig({
  site: 'https://opensourceops.github.io',
  base: '/agentctl/',
  outDir: './dist-agentctl',
  markdown: { processor: satteri({ hastPlugins: [focusableTables()] }) },
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
      lastUpdated: false,
      pagination: true,
      pagefind: true,
      credits: false,
      customCss: ['./src/styles/custom.css'],
      expressiveCode: {
        plugins: [{
          name: 'Initial keyboard access',
          hooks: {
            postprocessRenderedBlock: ({ renderData }) => {
              function enableFocus(node) {
                if (node.type === 'element' && node.tagName === 'pre') {
                  node.properties.tabIndex = 0;
                }
                for (const child of node.children ?? []) enableFocus(child);
              }
              enableFocus(renderData.blockAst);
            },
          },
        }],
        styleOverrides: {
          frames: { tooltipSuccessBackground: '#115e59', tooltipSuccessForeground: '#ffffff' },
        },
      },
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
          label: 'Start',
          items: [
            { slug: 'overview', label: 'What agentctl solves' },
            { slug: 'getting-started/installation', label: 'Install agentctl' },
            { slug: 'getting-started', label: 'First credential-free workflow' },
            { slug: 'guides/container', label: 'First container workflow' },
            { slug: 'getting-started/first-agent', label: 'First bounded agent' },
            { slug: 'why-agentctl', label: 'Why agentctl' },
            { slug: 'learning-paths', label: 'Choose a learning path' },
          ],
        },
        {
          label: 'Author',
          items: [
            { slug: 'guides/workflow-authoring', label: 'Author workflows' },
            { slug: 'concepts/workflow-model', label: 'YAML and the task model' },
            { slug: 'guides/variables', label: 'Variables and instruction files' },
            { slug: 'concepts/tools', label: 'Actions, tools, and effects' },
            { slug: 'concepts/policies', label: 'Policies and approvals' },
            { slug: 'concepts/memory', label: 'Memory' },
            { slug: 'concepts/packs', label: 'Reusable packs' },
          ],
        },
        {
          label: 'Cookbook',
          items: [
            { slug: 'examples', label: 'Choose a workflow' },
            { slug: 'examples/devops', label: 'DevOps cookbook and packages' },
            {
              label: 'CI developers',
              items: [
                { slug: 'examples/devops/01-ci-diagnosis', label: 'Diagnose a failed build' },
                { slug: 'examples/devops/02-junit-triage', label: 'Triage JUnit results' },
                { slug: 'examples/devops/03-pipeline-review', label: 'Review a pipeline' },
                { slug: 'examples/devops/07-dependency-update', label: 'Validate a vendored patch' },
                { slug: 'examples/devops/18-parallel-matrix', label: 'Check several services' },
              ],
            },
            {
              label: 'Platform and DevOps engineers',
              items: [
                { slug: 'examples/devops/04-dockerfile-review', label: 'Review a Dockerfile' },
                { slug: 'examples/devops/05-kubernetes-review', label: 'Validate Kubernetes YAML' },
                { slug: 'examples/devops/06-terraform-plan', label: 'Review a Terraform plan' },
                { slug: 'examples/devops/11-configuration-drift', label: 'Explain configuration drift' },
                { slug: 'examples/devops/14-local-deployment', label: 'Approve a local deployment' },
                { slug: 'examples/devops/19-role-subworkflow', label: 'Review a proposed change' },
              ],
            },
            {
              label: 'SREs',
              items: [
                { slug: 'examples/devops/12-incident-timeline', label: 'Build an incident timeline' },
                { slug: 'examples/devops/13-canary-evaluation', label: 'Evaluate a canary' },
                { slug: 'examples/devops/15-interrupted-deployment', label: 'Recover interrupted work' },
                { slug: 'examples/devops/16-retry-repair', label: 'Retry or repair a failure' },
                { slug: 'examples/devops/17-compensated-rollout', label: 'Compensate a failed rollout' },
                { slug: 'examples/devops/20-bounded-remediation', label: 'Bound a remediation loop' },
              ],
            },
            {
              label: 'Release and security practitioners',
              items: [
                { slug: 'examples/devops/08-sbom-triage', label: 'Triage an SBOM' },
                { slug: 'examples/devops/21-container-remediation', label: 'Remediate a container finding' },
                { slug: 'examples/devops/09-release-notes', label: 'Write evidenced release notes' },
                { slug: 'examples/devops/10-release-readiness', label: 'Enforce release gates' },
              ],
            },
          ],
        },
        {
          label: 'Operate and recover',
          items: [
            { slug: 'guides/local-operation', label: 'Run and inspect' },
            { slug: 'examples/approval-gated', label: 'Approve and resume' },
            { slug: 'durable-execution', label: 'Replay, retry, repair, and fork' },
            { slug: 'guides/selective-repair', label: 'Repair a failed workflow' },
            { slug: 'deployment-model', label: 'Choose a deployment model' },
            { slug: 'guides/container', label: 'Run in a container' },
            { slug: 'guides/ci-cd', label: 'Operate in CI' },
            { slug: 'operations/scheduled', label: 'Schedule externally' },
            { slug: 'observability', label: 'Logs and observability' },
            { slug: 'reference/database', label: 'State, locking, and retention' },
            { slug: 'troubleshooting', label: 'Troubleshoot a failed run' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { slug: 'reference/cli', label: 'CLI reference' },
            { slug: 'reference/yaml', label: 'YAML reference and schema' },
            { slug: 'reference/output', label: 'Output and exit codes' },
            { slug: 'providers', label: 'Provider overview' },
            { slug: 'reference/capabilities', label: 'Provider and tool capabilities' },
            { slug: 'providers/mcp', label: 'MCP' },
            { slug: 'providers/a2a', label: 'A2A' },
            { slug: 'reference/environment', label: 'Authentication and paths' },
            { slug: 'reference/limitations', label: 'Operational limits' },
            { slug: 'reference/compatibility', label: 'Compatibility contracts' },
            { slug: 'security', label: 'Security contracts' },
            { slug: 'security/threat-model', label: 'Threat model' },
            { slug: 'reference/terminology', label: 'Terminology' },
            { slug: 'reference/migration', label: 'Migrate from TypeScript' },
          ],
        },
        {
          label: 'Contribute and architecture',
          collapsed: true,
          items: [
            { slug: 'contributing', label: 'Contributor guide' },
            { slug: 'contributing/developer-guide', label: 'Developer guide' },
            { slug: 'architecture', label: 'Architecture' },
            { slug: 'architecture/diagrams', label: 'Architecture diagrams' },
            { slug: 'concepts/product', label: 'Product definition' },
            { slug: 'contributing/add-action', label: 'Add an action or tool' },
            { slug: 'contributing/add-provider', label: 'Add a provider' },
            { slug: 'contributing/add-migration', label: 'Add a migration' },
            { slug: 'contributing/documentation', label: 'Write documentation' },
            { slug: 'contributing/testing', label: 'Build and test' },
            { slug: 'contributing/release', label: 'Release process' },
            {
              label: 'Contracts and validation',
              items: [
                { slug: 'concepts/framework-completeness', label: 'Supported framework contract' },
                { slug: 'reference/launch-limitation-review', label: 'Validation and limitations' },
                { slug: 'reference/limitation-burndown', label: 'Boundary review records' },
                { slug: 'reference/completeness-verification', label: 'Verification records' },
                { slug: 'reference/live-framework-verification', label: 'Provider validation records' },
              ],
            },
            {
              label: 'Design decisions',
              items: ['architecture/decisions/0001', 'architecture/decisions/0002', 'architecture/decisions/0003', 'architecture/decisions/0004', 'architecture/decisions/0005', 'architecture/decisions/0006', 'architecture/decisions/0007'],
            },
          ],
        },
      ],
    }),
  ],
});
