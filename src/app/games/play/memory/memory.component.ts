import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, computed, inject, signal } from '@angular/core';
import { MEMBERS } from '../../../core/data/bts.data';
import { PlayerService } from '../../core/services/player.service';
import { shuffle } from '../../core/utils/shuffle';

interface Card {
  id: number;
  key: string;
  face: string;
  photo?: string;
  flipped: boolean;
  matched: boolean;
}

const CFG: Record<number, { pairs: number; limit: number; goal: number }> = {
  1: { pairs: 3, limit: 0, goal: 5 },
  2: { pairs: 6, limit: 0, goal: 11 },
  3: { pairs: 8, limit: 20, goal: 17 },
};

const SYMBOLS = [
  { key: 's-heart', face: '💜' },
  { key: 's-note', face: '🎵' },
  { key: 's-mic', face: '🎤' },
  { key: 's-star', face: '⭐' },
  { key: 's-bomb', face: '🪄' },
  { key: 's-moon', face: '🌙' },
  { key: 's-butter', face: '🧈' },
  { key: 's-disc', face: '💿' },
];

@Component({
  selector: 'app-memory',
  standalone: true,
  templateUrl: './memory.component.html',
  styleUrl: './memory.component.scss',
})
export class MemoryComponent implements OnInit, OnDestroy {
  private player = inject(PlayerService);

  @Input() level = 1;
  @Output() done = new EventEmitter<{ points: number; stars: number; timeMs: number }>();

  cfg = CFG[1];
  cards = signal<Card[]>([]);
  moves = signal(0);
  matches = signal(0);
  busy = signal(false);
  message = signal('');
  badPhotos = signal<Set<string>>(new Set());

  cols = computed(() => (this.cards().length <= 6 ? 3 : 4));
  movesLeft = computed(() => (this.cfg.limit ? Math.max(0, this.cfg.limit - this.moves()) : null));

  private open: Card[] = [];
  private started = Date.now();
  private timers: ReturnType<typeof setTimeout>[] = [];

  ngOnInit() {
    this.cfg = CFG[this.level] ?? CFG[1];

    // Integrantes (con foto si existe) + símbolos para completar las parejas
    const members = shuffle(MEMBERS).map((m) => ({ key: 'm-' + m.id, face: m.stage.charAt(0), photo: m.photo }));
    const symbols = shuffle(SYMBOLS);
    const pool = [...members.slice(0, Math.min(4, this.cfg.pairs)), ...symbols].slice(0, this.cfg.pairs);

    let id = 0;
    this.cards.set(
      shuffle(pool.flatMap((p) => [0, 1].map(() => ({ id: id++, ...p, flipped: false, matched: false }))))
    );
    this.started = Date.now();
    this.message.set(this.player.name() ? `¡Tú puedes, ${this.player.name()}! 💜` : '');
  }

  ngOnDestroy() {
    this.timers.forEach(clearTimeout);
  }

  bad(c: Card) {
    return !c.photo || this.badPhotos().has(c.photo);
  }

  markBad(url?: string) {
    if (url) this.badPhotos.update((s) => new Set(s).add(url));
  }

  flip(c: Card) {
    if (this.busy() || c.flipped || c.matched || this.over()) return;
    this.set(c, { flipped: true });
    this.open.push(c);
    if (this.open.length < 2) return;

    this.moves.update((m) => m + 1);
    const [a, b] = this.open;
    this.open = [];

    if (a.key === b.key) {
      this.set(a, { matched: true });
      this.set(b, { matched: true });
      this.matches.update((n) => n + 1);
      this.message.set(`¡Pareja, ${this.player.name() || 'ARMY'}! 💜`);
      this.after();
    } else {
      this.busy.set(true);
      this.timers.push(
        setTimeout(() => {
          this.set(a, { flipped: false });
          this.set(b, { flipped: false });
          this.busy.set(false);
          this.message.set('Sigue intentando 💜');
          this.after();
        }, 800)
      );
    }
  }

  private over() {
    return this.matches() >= this.cfg.pairs || (this.cfg.limit > 0 && this.moves() >= this.cfg.limit);
  }

  private after() {
    if (this.over()) this.timers.push(setTimeout(() => this.finish(), 700));
  }

  private set(c: Card, patch: Partial<Card>) {
    this.cards.update((list) => list.map((x) => (x.id === c.id ? { ...x, ...patch } : x)));
  }

  private finish() {
    const secs = (Date.now() - this.started) / 1000;
    const found = this.matches();
    const won = found >= this.cfg.pairs;

    const moveBonus = won ? Math.max(0, (this.cfg.goal + 6 - this.moves()) * 3) : 0;
    const timeBonus = won ? Math.max(0, Math.round(60 - secs / 2)) : 0;
    const points = found * 20 + moveBonus + timeBonus;

    let stars = 0;
    if (won) stars = this.moves() <= this.cfg.goal ? 3 : this.moves() <= this.cfg.goal + 3 ? 2 : 1;

    this.done.emit({ points, stars, timeMs: Date.now() - this.started });
  }
}