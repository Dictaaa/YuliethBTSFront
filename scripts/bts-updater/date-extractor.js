const MONTHS = {
  enero: 1, january: 1, febrero: 2, february: 2, marzo: 3, march: 3, abril: 4, april: 4,
  mayo: 5, may: 5, junio: 6, june: 6, julio: 7, july: 7, agosto: 8, august: 8,
  septiembre: 9, setiembre: 9, september: 9, octubre: 10, october: 10,
  noviembre: 11, november: 11, diciembre: 12, december: 12,
};
const MN = Object.keys(MONTHS).join('|');

const PATTERNS = [
  { re: /\b(20\d{2})-(\d{2})-(\d{2})\b/g, pick: (m) => [m[1], m[2], m[3]] },
  { re: new RegExp(`\\b(\\d{1,2}) de (${MN})(?: de)? (20\\d{2})\\b`, 'gi'), pick: (m) => [m[3], MONTHS[m[2].toLowerCase()], m[1]] },
  { re: new RegExp(`\\b(${MN}) (\\d{1,2})(?:st|nd|rd|th)?,? (20\\d{2})\\b`, 'gi'), pick: (m) => [m[3], MONTHS[m[1].toLowerCase()], m[2]] },
  { re: new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)? (${MN}),? (20\\d{2})\\b`, 'gi'), pick: (m) => [m[3], MONTHS[m[2].toLowerCase()], m[1]] },
];

/** Solo fechas con año explícito, futuras y dentro de 2 años. Si no hay, devuelve null. */
export function extractEventDate(text, now = new Date()) {
  const limit = new Date(now); limit.setFullYear(limit.getFullYear() + 2);
  const dates = [];

  for (const { re, pick } of PATTERNS) {
    for (const m of text.matchAll(re)) {
      const [y, mo, d] = pick(m).map(Number);
      const dt = new Date(Date.UTC(y, mo - 1, d));
      if (dt.getUTCMonth() !== mo - 1) continue; // fecha inválida
      if (dt >= now && dt <= limit) dates.push(dt);
    }
  }
  if (!dates.length) return null;
  dates.sort((a, b) => a - b);
  return dates[0].toISOString().slice(0, 10);
}

/** Fechas sin año: asume la próxima ocurrencia (máx. 12 meses). Solo para candidatos "por confirmar" */
export function extractLooseDate(text, now = new Date()) {
  const res = [
    { re: new RegExp(`\\b(\\d{1,2}) de (${MN})\\b`, 'gi'), pick: (m) => [MONTHS[m[2].toLowerCase()], m[1]] },
    { re: new RegExp(`\\b(${MN}) (\\d{1,2})(?:st|nd|rd|th)?\\b`, 'gi'), pick: (m) => [MONTHS[m[1].toLowerCase()], m[2]] },
    { re: new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)? (${MN})\\b`, 'gi'), pick: (m) => [MONTHS[m[2].toLowerCase()], m[1]] },
  ];
  const limit = new Date(now); limit.setFullYear(limit.getFullYear() + 1);
  const dates = [];

  for (const { re, pick } of res) {
    for (const m of text.matchAll(re)) {
      const [mo, d] = pick(m).map(Number);
      let dt = new Date(Date.UTC(now.getUTCFullYear(), mo - 1, d));
      if (dt.getUTCMonth() !== mo - 1) continue;
      if (dt < now) dt = new Date(Date.UTC(now.getUTCFullYear() + 1, mo - 1, d));
      if (dt <= limit) dates.push(dt);
    }
  }
  if (!dates.length) return null;
  dates.sort((a, b) => a - b);
  return dates[0].toISOString().slice(0, 10);
}