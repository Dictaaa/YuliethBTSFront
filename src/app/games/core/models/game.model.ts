export interface LevelDef {
  n: number;
  name: string;
  desc: string;
}

export interface GameDef {
  id: string;
  title: string;
  icon: string;
  tag: string;
  desc: string;
  levels: LevelDef[];
  soon?: boolean; // true = depende de datos que llenas tú
}

export type Stars = 0 | 1 | 2 | 3;

export interface GameResult {
  gameId: string;
  level: number;
  points: number;
  stars: Stars;
  timeMs?: number;
}

export interface SubmitOutcome {
  newBest: boolean;
  gained: number;
}

/** Lo que muestra la ventana de resultado */
export interface ResultView {
  points: number;
  stars: number;
  newBest: boolean;
  message: string;
  rankUp: string | null;
  hasNext: boolean;
}