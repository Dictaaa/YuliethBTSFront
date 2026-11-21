const decode = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
   .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

const clean = (s = '') =>
  decode(decode(s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')))
    .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? m[1] : '';
};

const linkOf = (b) => {
  const atom = b.match(/<link[^>]*href="([^"]+)"/i);
  return atom ? atom[1] : clean(tag(b, 'link'));
};

export async function readFeed(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'bts-yulieth-bot/1.0' } });
  if (!res.ok) throw new Error(`${res.status} en ${url}`);
  const xml = await res.text();
  const blocks = [...xml.matchAll(/<(item|entry)[\s>][\s\S]*?<\/\1>/g)].map((m) => m[0]);

  return blocks.map((b) => ({
    title: clean(tag(b, 'title')),
    link: linkOf(b),
    date: tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated'),
    description: clean(tag(b, 'description') || tag(b, 'media:description') || tag(b, 'summary')).slice(0, 220),
    origin: clean(tag(b, 'source')),
  }));
}