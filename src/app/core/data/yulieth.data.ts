export interface FavoriteAlbum {
  title: string;
  year: number;
  why: string;
}

export const YULIETH = {
  name: 'Yulieth',
  photo: 'assets/img/yulieth/perfil.jpg',
  tagline: 'Hola, soy Yulieth y te ayudo con todo lo relacionado con BTS 💜',
  intro:
    'Aquí encuentras quiénes son BTS, su música, su historia, sus próximos eventos y dónde conseguir su merch. Todo pensado para que las ARMY lo tengan en un solo lugar.',

  // TODO: reemplazar con los datos reales
  armySince: 2018,
  bias: 'Por definir',
  favoriteSong: 'Por definir',
  favoriteAlbum: 'Por definir',

  about: [
    'TODO: Cuenta aquí cómo conoció a BTS y qué fue lo primero que la enamoró del grupo.',
    'TODO: Cuenta qué significa para ella ser ARMY y qué momentos la han marcado.',
  ],

  mission:
    'Mi meta es que cualquier ARMY, nueva o de siempre, encuentre información clara, fechas al día y buenas opciones para comprar sin perderse en mil páginas.',

  favoriteAlbums: [
    { title: 'TODO: Álbum 1', year: 2020, why: 'Por qué es especial para ella.' },
    { title: 'TODO: Álbum 2', year: 2018, why: 'Por qué es especial para ella.' },
    { title: 'TODO: Álbum 3', year: 2016, why: 'Por qué es especial para ella.' },
  ] as FavoriteAlbum[],

  // Déjalo vacío ('') si no quiere mostrar alguna red
  socials: {
    instagram: '',
    tiktok: '',
    weverse: '',
  },
};

export const QUICK_LINKS = [
  { icon: '👥', title: 'Miembros', text: 'Conoce a los 7 integrantes', path: '/miembros' },
  { icon: '🎵', title: 'Música', text: 'Álbumes y canciones', path: '/musica' },
  { icon: '🕰️', title: 'Cronología', text: 'La historia desde 2013', path: '/cronologia' },
  { icon: '📅', title: 'Eventos', text: 'Próximas fechas', path: '/eventos' },
  { icon: '🛍️', title: 'Tienda', text: 'Merch y descuentos', path: '/tienda' },
  { icon: '✨', title: 'Sobre Yulieth', text: 'Mi portafolio ARMY', path: '/yulieth' },
];