import { GameDef } from '../models/game.model';

export const GAMES: GameDef[] = [
    {
        id: 'army-quiz', icon: '💜', tag: 'Imprescindible', title: '¿Qué tan ARMY eres?',
        desc: 'Preguntas sobre integrantes, canciones, álbumes y la historia de BTS.',
        levels: [
            { n: 1, name: 'Principiante', desc: '10 preguntas fáciles' },
            { n: 2, name: 'Dedicado', desc: '15 preguntas medias' },
            { n: 3, name: 'Experto', desc: '20 preguntas difíciles con tiempo' },
        ],
    },
    {
        id: 'guess-song', icon: '🎧', tag: 'Muy divertido', title: 'Adivina la canción',
        desc: 'Escucha un adelanto y adivina cuál es.',
        levels: [
            { n: 1, name: 'Fácil', desc: '3 pistas: 5, 10 y 20 segundos' },
            { n: 2, name: 'Medio', desc: '2 pistas: 4 y 8 segundos' },
            { n: 3, name: 'Difícil', desc: '1 sola pista de 3 segundos' },
        ],
    },
    {
        id: 'who-is', icon: '🕵️', tag: 'Clásico', title: '¿Quién es el integrante?',
        desc: 'Pistas, siluetas y fotos: descubre quién es.',
        levels: [
            { n: 1, name: 'Fácil', desc: 'Foto y 3 pistas' },
            { n: 2, name: 'Medio', desc: 'Silueta y 1 pista' },
            { n: 3, name: 'Difícil', desc: 'Una pista, 7 opciones' },
        ],
    },
    {
        id: 'emoji-song', icon: '🧈', tag: 'Rápido', title: 'Canciones con emojis',
        desc: 'Emojis que esconden el título de una canción.',
        levels: [
            { n: 1, name: 'Fácil', desc: '1 emoji' },
            { n: 2, name: 'Medio', desc: '2 emojis' },
            { n: 3, name: 'Difícil', desc: '3 emojis sin opciones' },
        ],
    },
    {
        id: 'memory', icon: '🃏', tag: 'Relajante', title: 'Memoria ARMY',
        desc: 'Encuentra las parejas de integrantes, álbumes y símbolos.',
        levels: [
            { n: 1, name: 'Fácil', desc: '6 cartas' },
            { n: 2, name: 'Medio', desc: '12 cartas' },
            { n: 3, name: 'Difícil', desc: '16 cartas, máximo 20 movimientos' },
        ],
    },
    {
        id: 'sort-albums', icon: '⏱️', tag: 'Contrarreloj', title: 'Ordena la discografía',
        desc: 'Ordena los álbumes por fecha de lanzamiento. Menos tiempo, más puntos.',
        levels: [
            { n: 1, name: 'Fácil', desc: '4 álbumes · 3 rondas' },
            { n: 2, name: 'Medio', desc: '6 álbumes · 3 rondas' },
            { n: 3, name: 'Difícil', desc: '8 álbumes · 3 rondas' },
        ],
    },
    {
        id: 'bestfriend-test', icon: '🫂', tag: 'Test', title: '¿Qué integrante sería tu mejor amigo?',
        desc: 'Responde sobre tus gustos y descubre con quién tienes más afinidad.',
        levels: [{ n: 1, name: 'El test', desc: 'Preguntas de personalidad' }],
    },
    {
        id: 'survive-concert', icon: '🎤', tag: 'Aventura', title: 'Sobrevive al concierto',
        desc: 'Elige outfit, lightstick y canciones, y prepara tu día perfecto como ARMY.',
        levels: [{ n: 1, name: 'El gran día', desc: 'Decisiones con consecuencias' }],
    },
    {
        id: 'word-search', icon: '🔤', tag: 'Con reloj', title: 'Sopa de letras ARMY',
        desc: 'Encuentra nombres, canciones y álbumes antes de que se acabe el tiempo.',
        levels: [
            { n: 1, name: 'Fácil', desc: '8×8 · 5 palabras · 2:30' },
            { n: 2, name: 'Medio', desc: '10×10 · 8 palabras · 3:00' },
            { n: 3, name: 'Difícil', desc: '12×12 · 10 palabras · 4:00' },
        ],
    },
    {
        id: 'who-said', icon: '💬', tag: 'Nuevo', title: '¿Quién dijo eso?',
        desc: 'Adivina qué integrante dijo cada frase. Todas tienen su fuente.',
        levels: [{ n: 1, name: 'Las frases', desc: 'Hasta 10 frases verificadas' }],
    },
];

export const findGame = (id: string) => GAMES.find((g) => g.id === id);