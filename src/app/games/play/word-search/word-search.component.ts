import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, computed, inject, signal } from '@angular/core';
import { PlayerService } from '../../core/services/player.service';
import { RIGHT, fill, pick } from '../../core/utils/messages';
import { shuffle } from '../../core/utils/shuffle';

const BANK = [
  'JIN', 'SUGA', 'JIMIN', 'ARMY', 'IDOL', 'SEVEN', 'MUSE', 'FACE', 'FIRE', 'WINGS', 'HYBE', 'PROOF',
  'BUTTER', 'GOLDEN', 'JHOPE', 'INDIGO', 'MAKNAE', 'DYNAMITE', 'BORAHAE', 'JUNGKOOK', 'LAYOVER',
  'PERSONA', 'EPIPHANY', 'WEVERSE', 'BANGTAN', 'WEMBLEY', 'NAMJOON', 'SEOKJIN', 'TAEHYUNG', 'LIGHTSTICK',
];

const D4 = [[0, 1], [1, 0]];
const D6 = [[0, 1], [1, 0], [1, 1], [0, -1]];
const D8 = [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]];

const CFG: Record<number, { size: number; count: number; maxLen: number; time: number; dirs: number[][] }> = {
  1: { size: 8, count: 5, maxLen: 6, time: 150, dirs: D4 },
  2: { size: 10, count: 8, maxLen: 8, time: 180, dirs: D6 },
  3: { size: 12, count: 10, maxLen: 12, time: 240, dirs: D8 },
};

const key = (r: number, c: number) => `${r},${c}`;

@Component({
  selector: 'app-word-search',
  standalone: true,
  templateUrl: './word-search.component.html',
  styleUrl: './word-search.component.scss',
})
export class WordSearchComponent implements OnInit, OnDestroy {
  private player = inject(PlayerService);

  @Input() level = 1;
  @Output() done = new EventEmitter<{ points: number; stars: number; timeMs: number }>();

  cfg = CFG[1];
  grid = signal<string[][]>([]);
  words = signal<string[]>([]);
  foundWords = signal<Set<string>>(new Set());
  foundCells = signal<Set<string>>(new Set());
  start = signal<{ r: number; c: number } | null>(null);
  left = signal(0);
  message = signal('');
  bad = signal(false);
  finished = signal(false);

  points = computed(() => this.foundWords().size * 20);
  timePct = computed(() => (this.cfg.time ? (this.left() / this.cfg.time) * 100 : 0));
  mmss = computed(() => {
    const s = Math.max(0, Math.ceil(this.left()));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  });

  private started = Date.now();
  private timer?: ReturnType<typeof setInterval>;
  private timeouts: ReturnType<typeof setTimeout>[] = [];

  ngOnInit() {
    this.cfg = CFG[this.level] ?? CFG[1];

    for (let attempt = 0; attempt < 40; attempt++) {
      const words = this.pickWords();
      const g = this.build(words);
      if (g) {
        this.words.set(words);
        this.grid.set(g);
        break;
      }
    }

    this.left.set(this.cfg.time);
    this.started = Date.now();
    this.message.set(`Toca la primera y la última letra de cada palabra, ${this.player.name() || 'ARMY'} 💜`);
    this.timer = setInterval(() => {
      const v = this.left() - 1;
      this.left.set(Math.max(0, v));
      if (v <= 0) this.end(false);
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
    this.timeouts.forEach(clearTimeout);
  }

  isFound(r: number, c: number) { return this.foundCells().has(key(r, c)); }
  isStart(r: number, c: number) { const s = this.start(); return !!s && s.r === r && s.c === c; }

  tap(r: number, c: number) {
    if (this.finished()) return;
    const s = this.start();
    this.bad.set(false);

    if (!s) { this.start.set({ r, c }); return; }
    if (s.r === r && s.c === c) { this.start.set(null); return; }

    const dr = r - s.r;
    const dc = c - s.c;
    const isLine = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
    if (!isLine) { this.start.set({ r, c }); return; } // no forma una línea: esta pasa a ser la nueva primera letra

    const len = Math.max(Math.abs(dr), Math.abs(dc));
    const sr = Math.sign(dr);
    const sc = Math.sign(dc);
    const cells: string[] = [];
    let text = '';
    const g = this.grid();
    for (let i = 0; i <= len; i++) {
      const rr = s.r + sr * i;
      const cc = s.c + sc * i;
      cells.push(key(rr, cc));
      text += g[rr][cc];
    }
    const rev = [...text].reverse().join('');
    const hit = this.words().find((w) => !this.foundWords().has(w) && (w === text || w === rev));
    this.start.set(null);

    if (hit) {
      this.foundWords.update((f) => new Set(f).add(hit));
      this.foundCells.update((f) => new Set([...f, ...cells]));
      this.message.set(`${fill(pick(RIGHT), this.player.name())} Encontraste ${hit} · +20`);
      if (this.foundWords().size >= this.words().length) {
        this.timeouts.push(setTimeout(() => this.end(true), 900));
      }
    } else {
      this.bad.set(true);
      this.message.set('Esa no es una de las palabras. ¡Sigue buscando! 💜');
    }
  }

  private end(won: boolean) {
    if (this.finished()) return;
    this.finished.set(true);
    if (this.timer) clearInterval(this.timer);

    const found = this.foundWords().size;
    const total = this.words().length;
    const bonus = won ? Math.round(this.left() / 3) : 0;
    const points = found * 20 + bonus;
    const ratio = total ? found / total : 0;
    const stars = won ? 3 : ratio >= 0.8 ? 2 : ratio >= 0.5 ? 1 : 0;

    this.message.set(
      won
        ? `¡Las encontraste todas, ${this.player.name() || 'ARMY'}! +${bonus} de bonus por tiempo 🎉`
        : `¡Se acabó el tiempo, ${this.player.name() || 'ARMY'}! ⏰`
    );
    this.timeouts.push(setTimeout(() => this.done.emit({ points, stars, timeMs: Date.now() - this.started }), 1200));
  }

  private pickWords(): string[] {
    const out: string[] = [];
    for (const w of shuffle(BANK.filter((x) => x.length <= this.cfg.maxLen))) {
      if (out.length >= this.cfg.count) break;
      if (out.some((o) => o.includes(w) || w.includes(o))) continue; // evita palabras dentro de otras
      out.push(w);
    }
    return out;
  }

  private build(words: string[]): string[][] | null {
    const n = this.cfg.size;
    const g: string[][] = Array.from({ length: n }, () => Array(n).fill(''));

    for (const w of [...words].sort((a, b) => b.length - a.length)) {
      let placed = false;
      for (let t = 0; t < 300 && !placed; t++) {
        const [dr, dc] = this.cfg.dirs[Math.floor(Math.random() * this.cfg.dirs.length)];
        const r = Math.floor(Math.random() * n);
        const c = Math.floor(Math.random() * n);
        const er = r + dr * (w.length - 1);
        const ec = c + dc * (w.length - 1);
        if (er < 0 || er >= n || ec < 0 || ec >= n) continue;

        let ok = true;
        for (let i = 0; i < w.length; i++) {
          const cur = g[r + dr * i][c + dc * i];
          if (cur && cur !== w[i]) { ok = false; break; }
        }
        if (!ok) continue;

        for (let i = 0; i < w.length; i++) g[r + dr * i][c + dc * i] = w[i];
        placed = true;
      }
      if (!placed) return null;
    }

    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return g.map((row) => row.map((ch) => ch || abc[Math.floor(Math.random() * abc.length)]));
  }
}