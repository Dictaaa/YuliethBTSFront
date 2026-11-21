const KPOP = /(k-?pop|hybe|big hit|army|bangtan|방탄|jungkook|jung kook|jimin|suga|agust d|j-?hope|taehyung|namjoon|seokjin|hoseok|yoongi|weverse)/i;
const IS_BTS = /\bBTS\b|방탄소년단|bangtan/i;

const MEMBERS = {
  RM: /\bRM\b|namjoon/i,
  Jin: /\bJin\b|seokjin/i,
  Suga: /\bsuga\b|agust d|yoongi/i,
  'J-Hope': /j-?hope|hoseok/i,
  Jimin: /\bjimin\b/i,
  V: /\bV\b(?= of| de BTS)|taehyung/i,
  'Jung Kook': /jung ?kook/i,
};

export function isBtsRelated(text) {
  return IS_BTS.test(text) && KPOP.test(text);
}

export function categoryOf(text) {
  if (/(concierto|gira|tour|concert|fan ?meeting|festival|entradas|tickets|boletas|stadium|estadio)/i.test(text)) return 'concert';
  if (/(álbum|album|sencillo|single|comeback|lanzamiento|release|video musical|music video|\bMV\b|teaser)/i.test(text)) return 'release';
  return 'news';
}

export function membersOf(text) {
  const found = Object.entries(MEMBERS).filter(([, re]) => re.test(text)).map(([n]) => n);
  return found.length ? found : ['BTS'];
}