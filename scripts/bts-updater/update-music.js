import { mkdir, readFile, writeFile } from 'node:fs/promises';

const OUT = 'src/assets/data/bts';
const ARTISTS = ['BTS', 'RM', 'Jin', 'SUGA', 'Agust D', 'j-hope', 'Jimin', 'V', 'Jung Kook'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(url) {
  for (let i = 0; i < 3; i++) {
    const res = await fetch(url, { headers: { 'user-agent': 'bts-yulieth-bot/1.0' } });
    if (res.ok) return res.json();
    await sleep(5000 * (i + 1)); // iTunes limita ~20 consultas por minuto
  }
  throw new Error('iTunes no respondió: ' + url);
}

const clean = (t) => t.replace(/ - (Single|EP)$/i, '').trim();
const key = (t) =>
  clean(t).toLowerCase().replace(/\(.*?\)|\[.*?\]/g, '').replace(/deluxe|edition/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

// 1) Álbumes de cada artista (filtra por nombre exacto y género K-Pop)
const albums = new Map();
for (const name of ARTISTS) {
  try {
    const { results = [] } = await api(
      `https://itunes.apple.com/search?term=${encodeURIComponent(name + ' BTS')}&entity=album&limit=200`
    );
    for (const a of results) {
      if (a.artistName?.toLowerCase() !== name.toLowerCase()) continue;
      if (!/k-?pop/i.test(a.primaryGenreName || '')) continue;
      const k = a.artistName + '|' + key(a.collectionName);
      const prev = albums.get(k);
      if (prev && prev.date <= a.releaseDate) continue; // se queda la edición más antigua
      albums.set(k, {
        itunesId: a.collectionId,
        date: a.releaseDate,
        title: clean(a.collectionName),
        artist: a.artistName,
        type: name === 'BTS' ? 'grupo' : 'solo',
        cover: a.artworkUrl100.replace('100x100', '600x600'),
        link: a.collectionViewUrl,
      });
    }
    console.log(`${name}: ${results.length} leídos`);
  } catch (e) {
    console.log(`${name}: ERROR ${e.message}`);
  }
  await sleep(3500);
}

// 2) Canciones con vista previa, en lotes de 5 álbumes
const list = [...albums.values()];
const tracks = new Map();
for (let i = 0; i < list.length; i += 5) {
  const ids = list.slice(i, i + 5).map((a) => a.itunesId).join(',');
  try {
    const { results = [] } = await api(`https://itunes.apple.com/lookup?id=${ids}&entity=song&limit=200`);
    for (const t of results) {
      if (t.wrapperType !== 'track' || !t.previewUrl) continue;
      if (!tracks.has(t.collectionId)) tracks.set(t.collectionId, []);
      tracks.get(t.collectionId).push({ n: t.trackNumber, name: t.trackName, preview: t.previewUrl });
    }
  } catch (e) {
    console.log('Lote con error: ' + e.message);
  }
  await sleep(3500);
}

const out = list
  .map((a) => {
    const t = (tracks.get(a.itunesId) || []).sort((x, y) => x.n - y.n).map(({ name, preview }) => ({ name, preview }));
    return {
      id: String(a.itunesId),
      title: a.title,
      year: new Date(a.date).getFullYear(),
      artist: a.artist,
      type: a.type,
      cover: a.cover,
      link: a.link,
      songs: t.slice(0, 6).map((x) => x.name),
      tracks: t,
    };
  })
  .filter((a) => a.tracks.length)
  .sort((a, b) => b.year - a.year);

// Si algo salió mal y no hay datos, no pisamos el archivo anterior
let previous = [];
try { previous = JSON.parse(await readFile(`${OUT}/albums.json`, 'utf8')); } catch {}

if (out.length >= Math.min(10, previous.length)) {
  await mkdir(OUT, { recursive: true });
  await writeFile(`${OUT}/albums.json`, JSON.stringify(out, null, 2));
  console.log(`${out.length} álbumes guardados`);
} else {
  console.log(`Solo ${out.length} álbumes (antes ${previous.length}): no se sobrescribe`);
}