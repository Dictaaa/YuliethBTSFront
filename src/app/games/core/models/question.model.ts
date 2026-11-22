export interface Question {
  level: 1 | 2 | 3;
  q: string;
  answer: string;
  options: string[]; // incluye la correcta; el juego las mezcla
}