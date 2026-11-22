import { Injectable, computed, inject } from '@angular/core';
import { ScoreService } from './score.service';

export interface Rank {
  key: string;
  label: string;
  icon: string;
  min: number;
}

// Umbrales provisionales: los ajustamos cuando existan los puntos reales de cada juego
// Máximo teórico ≈ 5.900 puntos entre todos los juegos. Ajusta según cómo jueguen.
export const RANKS: Rank[] = [
  { key: 'principiante', label: 'ARMY principiante', icon: '🌱', min: 0 },
  { key: 'dedicado', label: 'ARMY dedicado', icon: '💜', min: 700 },
  { key: 'experto', label: 'ARMY experto', icon: '⭐', min: 2000 },
  { key: 'legendario', label: 'ARMY legendario', icon: '👑', min: 4000 },
];

@Injectable({ providedIn: 'root' })
export class RankService {
  private score = inject(ScoreService);

  current = computed(
    () => [...RANKS].reverse().find((r) => this.score.total() >= r.min) ?? RANKS[0]
  );

  next = computed(() => RANKS.find((r) => r.min > this.score.total()) ?? null);

  missing = computed(() => {
    const n = this.next();
    return n ? n.min - this.score.total() : 0;
  });

  /** % de avance hacia el siguiente rango */
  progress = computed(() => {
    const n = this.next();
    if (!n) return 100;
    const c = this.current();
    return Math.round(((this.score.total() - c.min) / (n.min - c.min)) * 100);
  });
}