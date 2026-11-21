const gnews = (q, hl, gl) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q + ' when:7d')}&hl=${hl}&gl=${gl}&ceid=${gl}:${hl}`;

export const SOURCES = [
  { name: 'Google News (ES)', official: false, url: gnews('BTS K-pop concierto gira', 'es-419', 'CO') },
  { name: 'Google News (ES)', official: false, url: gnews('BTS K-pop álbum lanzamiento', 'es-419', 'CO') },
  { name: 'Google News (EN)', official: false, url: gnews('BTS K-pop tour concert', 'en', 'US') },
  { name: 'Google News (EN)', official: false, url: gnews('BTS HYBE album release', 'en', 'US') },

  // Canales oficiales de YouTube. VERIFICA los channel_id abriendo el canal > Compartir > Copiar ID del canal
  { name: 'BANGTANTV (YouTube)', official: true, url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCLkAepWjdylmXSltofFvsYQ' },
  { name: 'HYBE LABELS (YouTube)', official: true, url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC3IZKseVpdzPSBaWxBxundA' },
];