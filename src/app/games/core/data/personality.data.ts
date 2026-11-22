export interface PAnswer {
  text: string;
  w: string[]; // ids de integrantes: el primero suma 2, los demás 1
}

export interface PQuestion {
  q: string;
  options: PAnswer[];
}

export const PERSONALITY: PQuestion[] = [
  {
    q: 'Es sábado y no tienes tareas. ¿Qué plan eliges?',
    options: [
      { text: 'Librería, museo y un café', w: ['rm', 'v'] },
      { text: 'Quedarme en casa con música y siesta', w: ['suga', 'jin'] },
      { text: 'Clase de baile o salir con amigos', w: ['jhope', 'jimin'] },
      { text: 'Videojuegos o deporte', w: ['jungkook', 'jin'] },
    ],
  },
  {
    q: 'Tienes un problema. ¿Cómo lo enfrentas?',
    options: [
      { text: 'Lo analizo y lo escribo para entenderlo', w: ['rm'] },
      { text: 'Hago un chiste y sigo adelante', w: ['jin', 'jhope'] },
      { text: 'Hablo con alguien de confianza', w: ['jimin', 'v'] },
      { text: 'Me pongo un reto y practico hasta resolverlo', w: ['jungkook', 'suga'] },
    ],
  },
  {
    q: 'En tu grupo de amigos, tú eres…',
    options: [
      { text: 'El que organiza y propone ideas', w: ['rm', 'jungkook'] },
      { text: 'El que contagia energía a todos', w: ['jhope', 'jimin'] },
      { text: 'El que hace reír con cualquier cosa', w: ['jin', 'v'] },
      { text: 'El tranquilo que dice lo justo', w: ['suga', 'rm'] },
    ],
  },
  {
    q: '¿Qué música te acompaña más en el día?',
    options: [
      { text: 'Hip hop con letras que hacen pensar', w: ['suga', 'rm'] },
      { text: 'Pop animado para bailar', w: ['jhope', 'jimin'] },
      { text: 'Baladas y jazz', w: ['v', 'jin'] },
      { text: 'De todo un poco, según el momento', w: ['jungkook', 'jimin'] },
    ],
  },
  {
    q: '¿Cuál es tu mejor cualidad?',
    options: [
      { text: 'Nunca me rindo', w: ['jimin', 'jungkook'] },
      { text: 'Mi sentido del humor', w: ['jin'] },
      { text: 'Mi creatividad', w: ['v', 'suga'] },
      { text: 'Mi optimismo', w: ['jhope', 'rm'] },
    ],
  },
  {
    q: 'En una fiesta, ¿dónde te encuentran?',
    options: [
      { text: 'Bailando en el centro', w: ['jhope', 'jungkook'] },
      { text: 'Conversando de temas profundos', w: ['rm', 'v'] },
      { text: 'Cerca de la comida, feliz', w: ['jin', 'suga'] },
      { text: 'Pasándola bien con quien me quiere cerca', w: ['jimin', 'jin'] },
    ],
  },
  {
    q: '¿Qué regalo te haría más feliz?',
    options: [
      { text: 'Un libro o una obra de arte', w: ['rm', 'v'] },
      { text: 'Entradas para un concierto', w: ['jimin', 'jhope'] },
      { text: 'Una consola o equipo deportivo', w: ['jungkook', 'suga'] },
      { text: 'Una cena especial', w: ['jin', 'jimin'] },
    ],
  },
  {
    q: '¿Cómo empiezas tu mañana ideal?',
    options: [
      { text: 'Madrugo y hago ejercicio', w: ['jungkook', 'jhope'] },
      { text: 'Duermo cinco minutos más', w: ['suga', 'jin'] },
      { text: 'Café y un rato de lectura', w: ['rm', 'v'] },
      { text: 'Me arreglo con calma y escucho música', w: ['jimin', 'v'] },
    ],
  },
];

// Descripciones de juego, no datos reales de las personas
export const PROFILES: Record<string, string> = {
  rm: 'Curiosa/o y reflexiva/o: te gusta entender las cosas, leer y conversar de ideas que importan.',
  jin: 'Cálida/o y bromista: haces reír a todos y te encanta cuidar a la gente que quieres.',
  suga: 'Tranquila/o y directa/o: valoras tu espacio, la buena música y la sinceridad.',
  jhope: 'Pura energía y optimismo: contagias alegría y te mueves con ganas.',
  jimin: 'Cariñosa/o y esforzada/o: das todo por lo que quieres y cuidas los detalles.',
  v: 'Creativa/o y libre: ves el mundo a tu manera y amas el arte y la música con alma.',
  jungkook: 'Disciplinada/o y competitiva/o: siempre quieres aprender y superarte.',
};