import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dir = join(root, 'data/records');
const issues = [];
const seenIds = new Map();
const seenLatinNames = new Map();

function note(map, key, file, label) {
  if (!key) return;
  if (map.has(key)) {
    issues.push(`duplicate ${label}: ${key} (${file} duplicates ${map.get(key)})`);
  } else {
    map.set(key, file);
  }
}

if (existsSync(dir)) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const file = join(dir, entry.name);
    let data;
    try {
      data = JSON.parse(readFileSync(file, 'utf8'));
    } catch (error) {
      issues.push(`invalid JSON in ${file}: ${error.message}`);
      continue;
    }

    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      issues.push(`record must be an object: ${file}`);
      continue;
    }

    const required = ['id', 'latin_name', 'summary_ru', 'status'];
    for (const field of required) {
      if (typeof data[field] !== 'string' || data[field].trim() === '') {
        issues.push(`missing or empty ${field} in ${file}`);
      }
    }

    note(seenIds, data.id?.trim(), file, 'id');
    note(seenLatinNames, data.latin_name?.trim(), file, 'latin_name');

    const allowedStatus = new Set(['draft', 'uncertain', 'accepted', 'deprecated', 'rejected']);
    if (data.status && !allowedStatus.has(data.status)) {
      issues.push(`invalid status in ${file}: ${data.status}`);
    }
  }
}

if (issues.length > 0) {
  for (const issue of issues) console.error(issue);
  process.exit(1);
}

console.log('ok: record validation passed');
