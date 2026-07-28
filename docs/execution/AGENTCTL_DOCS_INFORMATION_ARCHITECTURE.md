# agentctl documentation information architecture

## Principles

- Organize the site around user questions and journeys.
- Keep behavioral truth in the `agentctl` repository.
- Keep presentation, navigation, learning paths, and deployment in the Pages repository.
- Link to one canonical page instead of repeating a technical contract.
- Create a page only when it provides verified, useful content.

## Top navigation

- Docs
- Guides
- Examples
- Architecture
- Contributing
- GitHub
- workflow API `v1` indicator

## Learning paths

- I am evaluating agentctl
- I want to run my first workflow
- I want to author workflows
- I want to operate agentctl
- I want to integrate agentctl into CI/CD
- I want to contribute

## Sidebar groups

1. Start here
2. Learn the workflow model
3. Run workflows
4. Operate agentctl
5. Providers and protocols
6. Security
7. Examples and use cases
8. Troubleshooting
9. Reference
10. Architecture
11. Contributing

The first release uses comprehensive pages for closely related topics rather than many thin pages. For example, one provider overview owns capability differences, authentication, validation levels, and troubleshooting links.

## Route model

The public base is `https://opensourceops.github.io/agentctl/`. The framework builds the agentctl site independently, then an assembly step places that output under `_site/agentctl/` beside a restrained organization root page.

Canonical imports are generated beneath `src/content/docs/_generated/` and are never edited by hand. Site-authored pages live elsewhere in `src/content/docs/`.
