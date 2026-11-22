import { Component, EventEmitter, Input, OnInit, Output, computed, inject, signal } from '@angular/core';
import { ALL_TITLES, EMOJI_SONGS } from '../../core/data/emoji-songs.data';
import { PlayerService } from '../../core/services/player.service';
import { RIGHT, WRONG, fill, pick } from '../../core/utils/messages';
import { shuffle } from '../../core/utils/shuffle';

interface Round {
  emojis: string[];
  title: string;
  aliases: string[];
  options: string[];
}

const CFG: Record<number, { count: number; pts: number; typed: boolean }> = {
  1: { count: 10, pts: 10, typed: false },
  2: { count: 10, pts: 15, typed: false },
  3: { count: 10, pts: 25, typed: true },
};

const HINT_COST = 5;

const norm = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '');

function lev(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

@Component({
  selector: 'app-emoji-song',
  standalone: true,
  templateUrl: './emoji-song.component.html',
  styleUrl: './emoji-song.component.scss',
})
export class EmojiSongComponent implements OnInit {
  private player = inject(PlayerService);

  @Input() level = 1;
  @Output() done = new EventEmitter<{ points: number; stars: number; timeMs: number }>();

  letters = ['A', 'B', 'C', 'D'];
  cfg = CFG[1];

  rounds = signal<Round[]>([]);
  idx = signal(0);
  picked = signal<string | null>(null);
  typed = signal('');
  hinted = signal(false);
  points = signal(0);
  correct = signal(0);
  streak = signal(0);
  feedback = signal('');
  lastOk = signal(false);

  total = computed(() => this.rounds().length);
  current = computed(() => this.rounds()[this.idx()]);
  progress = computed(() => (this.total() ? (this.idx() / this.total()) * 100 : 0));
  isLast = computed(() => this.idx() >= this.total() - 1);

  hintText = computed(() => {
    const r = this.current();
    if (!r) return '';
    const letters = r.title.replace(/[^\p{L}\p{N}]/gu, '').length;
    return `Empieza con "${r.title.charAt(0).toUpperCase()}" · ${letters} letras`;
  });

  private started = Date.now();

  ngOnInit() {
    this.cfg = CFG[this.level] ?? CFG[1];
    const pool = shuffle(EMOJI_SONGS.filter((x) => x.level === this.level)).slice(0, this.cfg.count);

    this.rounds.set(
      pool.map((x) => {
        const others = shuffle(ALL_TITLES.filter((t) => t !== x.title)).slice(0, 3);
        return {
          emojis: x.emojis,
          title: x.title,
          aliases: x.aliases ?? [],
          options: this.cfg.typed ? [] : shuffle([x.title, ...others]),
        };
      })
    );
    this.started = Date.now();
  }

  state(o: string): 'ok' | 'bad' | 'dim' | '' {
    const p = this.picked();
    if (p === null) return '';
    if (o === this.current().title) return 'ok';
    return o === p ? 'bad' : 'dim';
  }

  choose(o: string) {
    if (this.picked() !== null) return;
    this.resolve(o === this.current().title, o);
  }

  submit() {
    const value = this.typed().trim();
    if (this.picked() !== null || !value) return;
    this.resolve(this.matches(value), value);
  }

  hint() {
    if (this.picked() === null) this.hinted.set(true);
  }

  next() {
    if (this.isLast()) return this.finish();
    this.idx.update((i) => i + 1);
    this.picked.set(null);
    this.typed.set('');
    this.hinted.set(false);
  }

  private matches(value: string): boolean {
    const r = this.current();
    const input = norm(value);
    return [r.title, ...r.aliases].some((t) => {
      const n = norm(t);
      const tolerance = n.length >= 8 ? 2 : n.length >= 5 ? 1 : 0;
      return lev(input, n) <= tolerance;
    });
  }

  private resolve(ok: boolean, shown: string) {
    const name = this.player.name();
    this.picked.set(shown);

    if (ok) {
      const streak = this.streak() + 1;
      const combo = Math.min(10, (streak - 1) * 2);
      const gain = Math.max(5, this.cfg.pts + combo - (this.hinted() ? HINT_COST : 0));

      this.streak.set(streak);
      this.correct.update((c) => c + 1);
      this.points.update((p) => p + gain);
      this.lastOk.set(true);
      this.feedback.set(`${fill(pick(RIGHT), name)} +${gain} puntos`);
    } else {
      this.streak.set(0);
      this.lastOk.set(false);
      this.feedback.set(`${fill(pick(WRONG), name)} Era: ${this.current().title}`);
    }
  }

  private finish() {
    const ratio = this.total() ? this.correct() / this.total() : 0;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.75 ? 2 : ratio >= 0.5 ? 1 : 0;
    this.done.emit({ points: this.points(), stars, timeMs: Date.now() - this.started });
  }
}