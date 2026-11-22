export const WIN = [
  '¡Excelente, {nombre}!',
  '¡Increíble, {nombre}! 💜',
  '¡Eso fue de leyenda, {nombre}!',
  '¡Lo lograste, {nombre}!',
  '¡Borahae, {nombre}! Qué buen juego 💜',
];

export const TRY = [
  '¡Casi, {nombre}! Inténtalo otra vez.',
  'No te rindas, {nombre} 💜',
  'Tú puedes, {nombre}. ¡Una vez más!',
];

export const HELLO = ['¡Hola, {nombre}! 💜', '¡Qué bueno verte, {nombre}!', '¡Bienvenida/o de vuelta, {nombre}!'];

export const fill = (text: string, name: string) => text.replace(/\{nombre\}/g, name || 'ARMY');

export const pick = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

export const RIGHT = [
  '¡Excelente, {nombre}!',
  '¡Correcto, {nombre}! 💜',
  '¡Así se hace, {nombre}!',
  '¡Eres una ARMY de verdad, {nombre}!',
];

export const WRONG = [
  '¡Uy, casi, {nombre}!',
  'No pasa nada, {nombre} 💜',
  'Esa era difícil, {nombre}.',
];

export const TIMEUP = '¡Se acabó el tiempo, {nombre}! ⏰';