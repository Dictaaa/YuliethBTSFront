import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

export const makeId = (item) =>
  'bts-' + createHash('sha1').update(item.sourceUrl || item.title).digest('hex').slice(0, 12);

const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

export async function loadJson(path) {
  try { return JSON.parse(await readFile(path, 'utf8')); } catch { return []; }
}

export function isValid(i) {
  return i.title && i.title.length > 8 && /^https?:\/\//.test(i.sourceUrl) && !isNaN(new Date(i.publishedAt));
}

/** Une lo nuevo con lo existente sin duplicar (por id o por título parecido) y conserva el historial */
export function merge(existing, incoming, max = 200) {
  const ids = new Set(existing.map((x) => x.id));
  const titles = new Set(existing.map((x) => norm(x.title)));
  const added = [];

  for (const it of incoming) {
    const t = norm(it.title);
    if (ids.has(it.id) || titles.has(t)) continue;
    ids.add(it.id); titles.add(t); added.push(it);
  }
  const all = [...added, ...existing].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return { list: all.slice(0, max), added: added.length };
}