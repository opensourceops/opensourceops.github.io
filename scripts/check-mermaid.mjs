import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docs = path.join(root, 'src/content/docs');

async function markdownFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await markdownFiles(absolute)));
    else if (/\.mdx?$/.test(entry.name)) result.push(absolute);
  }
  return result;
}

let count = 0;
for (const file of await markdownFiles(docs)) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/```mermaid\n([\s\S]*?)```/g)) {
    const definition = match[1].trim();
    if (!/^(?:flowchart|sequenceDiagram|stateDiagram-v2)\b/.test(definition)) {
      throw new Error(`Unsupported or missing Mermaid diagram type in ${file}`);
    }
    if (definition.split('\n').length < 2) {
      throw new Error(`Empty Mermaid diagram in ${file}`);
    }
    count += 1;
  }
}
if (count < 14) throw new Error(`Expected at least 14 Mermaid diagrams, found ${count}`);
console.log(`Validated ${count} Mermaid source blocks. Browser tests verify rendering.`);
