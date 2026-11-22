import { Injectable, computed, inject, signal } from '@angular/core';
import { GameResult, SubmitOutcome } from '../models/game.model';
import { load, remove, save, today } from '../../core/utils/storage';
import { PlayerService } from './player.service';

export interface Rec {
  points: number;
  stars: number;
  plays: number;
  timeMs?: number;
}

export interface RankEntry {
  name: string;
  gameId: string;
  level: number;
  points: number;
  date: string;
}

const K_SCORES = 'army.scores';
const K_BONUS = 'army.bonus';
const K_RANK = 'army.ranking';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  private player = inject(PlayerService);

  records = signal<Record<string, Rec>>(load(K_SCORES, {}));
  bonus = signal<number>(load(K_BONUS, 0));
  ranking = signal<RankEntry[]>(load(K_RANK, []));

  /** Suma del mejor puntaje de cada nivel + bonos (así repetir un nivel no infla el total) */
  total = computed(
    () => Object.values(this.records()).reduce((s, r) => s + r.points, 0) + this.bonus()
  );
  totalStars = computed(() => Object.values(this.records()).reduce((s, r) => s + r.stars, 0));

  private key = (g: string, l: number) => `${g}:${l}`;

  rec(g: string, l: number): Rec | undefined {
    return this.records()[this.key(g, l)];
  }

  stars(g: string, l: number): number {
    return this.rec(g, l)?.stars ?? 0;
  }

  starsOf(g: string): number {
    return Object.entries(this.records())
      .filter(([k]) => k.startsWith(g + ':'))
      .reduce((s, [, r]) => s + r.stars, 0);
  }

  /** El nivel 1 siempre está abierto; los demás piden 1 estrella o más en el anterior */
  unlocked(g: string, l: number): boolean {
    return l <= 1 || this.stars(g, l - 1) >= 1;
  }

  submit(r: GameResult): SubmitOutcome {
    const k = this.key(r.gameId, r.level);
    const prev = this.records()[k];
    const prevPts = prev?.points ?? 0;
    const best = Math.max(prevPts, r.points);

    let timeMs = prev?.timeMs;
    if (r.timeMs !== undefined && (timeMs === undefined || r.timeMs < timeMs)) timeMs = r.timeMs;

    const next: Rec = {
      points: best,
      stars: Math.max(prev?.stars ?? 0, r.stars),
      plays: (prev?.plays ?? 0) + 1,
      timeMs,
    };
    const all = { ...this.records(), [k]: next };
    this.records.set(all);
    save(K_SCORES, all);

    if (r.points > 0) {
      const entry: RankEntry = {
        name: this.player.name() || 'ARMY',
        gameId: r.gameId,
        level: r.level,
        points: r.points,
        date: today(),
      };
      const top = [...this.ranking(), entry].sort((a, b) => b.points - a.points).slice(0, 20);
      this.ranking.set(top);
      save(K_RANK, top);
    }

    return { newBest: r.points > prevPts, gained: best - prevPts };
  }

  addBonus(n: number) {
    this.bonus.update((b) => b + n);
    save(K_BONUS, this.bonus());
  }

  reset() {
    this.records.set({});
    this.bonus.set(0);
    this.ranking.set([]);
    [K_SCORES, K_BONUS, K_RANK].forEach(remove);
  }
}