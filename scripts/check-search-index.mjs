import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagefind = path.join(root, '_site/agentctl/pagefind/pagefind.js');
await stat(pagefind);
const indexSource = await readFile(pagefind, 'utf8');
if (!indexSource.includes('Pagefind')) throw new Error('Pagefind browser bundle is malformed');

const representative = ['replay', 'OPENAI_API_KEY', 'approval', 'container', 'exit code', 'database locked', 'MCP', 'Gemini'];
const html = await readFile(path.join(root, '_site/agentctl/index.html'), 'utf8');
if (!html.includes('data-pagefind-body')) throw new Error('Homepage is not marked for Pagefind indexing');
console.log(`Pagefind index exists. Browser tests query: ${representative.join(', ')}.`);
