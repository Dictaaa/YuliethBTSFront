import { mkdir, writeFile } from 'node:fs/promises';
import { SOURCES } from './sources.js';
import { readFeed } from './rss-reader.js';
import { isBtsRelated, categoryOf, membersOf } from './classifier.js';
import { extractEventDate, extractLooseDate } from './date-extractor.js';
import { isValid, loadJson, makeId, merge } from './validator.js';

const OUT = 'src/assets/data/bts';
const today = new Date().toISOString().slice(0, 10);
const incoming = [];
const report = [];

for (const src of SOURCES) {
  try {
    const items = await readFeed(src.url);
    let kept = 0;
    for (const it of items) {
      const text = `${it.title} ${it.description}`;
      // Los canales oficiales de YouTube ya son de BTS/HYBE; a los medios se les exige el filtro
      if (!src.official && !isBtsRelated(text)) continue;
      if (src.official && !/BTS|방탄|Jung ?Kook|Jimin|\bV\b|Suga|RM|Jin|j-?hope/i.test(text)) continue;

      const category = categoryOf(text);
      const publishedAt = isNaN(new Date(it.date)) ? today : new Date(it.date).toISOString().slice(0, 10);
      const item = {
        title: it.title,
        description: it.description,
        category: src.official && category === 'news' ? 'video' : category,
        relatedMembers: membersOf(text),
        publishedAt,
        eventDate: category === 'concert' ? (extractEventDate(text) ?? extractLooseDate(text)) : null,
        status: src.official ? 'official' : 'reported',
        source: it.origin || src.name,
        sourceUrl: it.link,
        lastVerified: today,
      };
      item.id = makeId(item);
      if (isValid(item)) { incoming.push(item); kept++; }
    }
    report.push(`${src.name}: ${items.length} leídos, ${kept} relevantes`);
  } catch (e) {
    report.push(`${src.name}: ERROR ${e.message}`); // una fuente caída no detiene a las demás
  }
}

await mkdir(OUT, { recursive: true });

// Noticias, lanzamientos y videos (historial acumulado)
const news = merge(await loadJson(`${OUT}/news.json`), incoming);
await writeFile(`${OUT}/news.json`, JSON.stringify(news.list, null, 2));

// Candidatos a evento: NO se publican solos, tú los verificas y los pasas a events.json
const candidates = incoming.filter((i) => i.category === 'concert' && i.eventDate);
const oldPending = (await loadJson(`${OUT}/events-pending.json`)).filter((e) => e.eventDate >= today);
const pending = merge(oldPending, candidates.map((c) => ({ ...c, status: 'unconfirmed' })), 100);
await writeFile(`${OUT}/events-pending.json`, JSON.stringify(pending.list, null, 2));

await writeFile(`${OUT}/metadata.json`, JSON.stringify({ lastRun: new Date().toISOString(), report }, null, 2));

console.log(report.join('\n'));
console.log(`Nuevas: ${news.added} · Candidatos a evento nuevos: ${pending.added}`);