import { existsSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const required = [
  'README.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'MODERATION_POLICY.md',
  'AGENTS.md',
  'docs/philosophy.md',
  'docs/governance.md',
  'docs/technical-architecture.md',
  'data/schema.yaml',
  'site/index.html',
  'site/styles.css',
  '.gitignore'
];

const forbidden = ['.crew', 'node_modules', 'dist', 'build'];
let failed = false;

for (const file of required) {
  if (!existsSync(join(root, file))) {
    console.error(`missing: ${file}`);
    failed = true;
  }
}

for (const dir of forbidden) {
  if (existsSync(join(root, dir))) {
    console.error(`forbidden directory present: ${dir}`);
    failed = true;
  }
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = full.slice(root.length + 1);
    if (rel.startsWith('.git/')) continue;
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

for (const file of walk(root)) {
  const size = statSync(file).size;
  if (size > 1_000_000) {
    console.error(`large file should not be committed: ${file} (${size} bytes)`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('ok: project structure is simple and complete');
