import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, computed, inject, signal } from '@angular/core';
import { ALBUMS } from '../../core/data/music.data.proxy';
import { PlayerService } from '../../core/services/player.service';
import { shuffle } from '../../core/utils/shuffle';

interface Item {
  title: string;
  year: number;
  id: string;
}

const CFG: Record<number, { size: number; rounds: number; perOk: number }> = {
  1: { size: 4, rounds: 3, perOk: 8 },
  2: { size: 6, rounds: 3, perOk: 10 },
  3: { size: 8, rounds: 3, perOk: 14 },
};

@Component({
  selector: 'app-sort-albums',
  standalone: true,
  templateUrl: './sort-albums.component.html',
  styleUrl: './sort-albums.component.scss',
})
export class SortAlbumsComponent implements OnInit, OnDestroy {
  private player = inject(PlayerService);

  @Input() level = 1;
  @Output() done = new EventEmitter<{ points: number; stars: number; timeMs: number }>();

  cfg = CFG[1];
  round = signal(0);
  list = signal<Item[]>([]);
  checked = signal(false);
  marks = signal<boolean[]>([]);
  points = signal(0);
  okTotal = signal(0);
  feedback = signal('');
  secs = signal(0);

  perfect = computed(() => this.checked() && this.marks().every(Boolean));
  isLast = computed(() => this.round() >= this.cfg.rounds - 1);

  private started = Date.now();
  private roundStart = Date.now();
  private tick?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.cfg = CFG[this.level] ?? CFG[1];
    this.started = Date.now();
    this.newRound();
    this.tick = setInterval(() => this.secs.set(Math.floor((Date.now() - this.roundStart) / 1000)), 500);
  }

  ngOnDestroy() {
    if (this.tick) clearInterval(this.tick);
  }

  private newRound() {
    // Un álbum por año (sin empates) para que el orden sea claro
    const byYear = new Map<number, Item>();
    for (const a of shuffle(ALBUMS)) if (!byYear.has(a.year)) byYear.set(a.year, a);

    let pick = shuffle([...byYear.values()]).slice(0, this.cfg.size);
    // Evita que arranque ya ordenado
    for (let i = 0; i < 5 && this.sorted(pick); i++) pick = shuffle(pick);

    this.list.set(pick);
    this.checked.set(false);
    this.marks.set([]);
    this.feedback.set('');
    this.roundStart = Date.now();
    this.secs.set(0);
  }

  private sorted(l: Item[]) {
    return l.every((x, i) => i === 0 || l[i - 1].year <= x.year);
  }

  move(i: number, d: number) {
    if (this.checked()) return;
    const j = i + d;
    const l = [...this.list()];
    if (j < 0 || j >= l.length) return;
    [l[i], l[j]] = [l[j], l[i]];
    this.list.set(l);
  }

  check() {
    if (this.checked()) return;
    const l = this.list();
    const correct = [...l].sort((a, b) => a.year - b.year);
    const marks = l.map((x, i) => x.year === correct[i].year);
    const ok = marks.filter(Boolean).length;
    const elapsed = (Date.now() - this.roundStart) / 1000;

    const speed = ok === l.length ? Math.max(0, Math.round(30 - elapsed)) : 0;
    const gain = ok * this.cfg.perOk + speed;

    this.marks.set(marks);
    this.checked.set(true);
    this.okTotal.update((n) => n + ok);
    this.points.update((p) => p + gain);

    const name = this.player.name() || 'ARMY';
    this.feedback.set(
      ok === l.length
        ? `¡Perfecto, ${name}! +${gain} puntos${speed ? ` (con ${speed} de bonus por rapidez)` : ''}`
        : `Acertaste ${ok} de ${l.length}, ${name}. +${gain} puntos`
    );
  }

  next() {
    if (this.isLast()) return this.finish();
    this.round.update((r) => r + 1);
    this.newRound();
  }

  private finish() {
    if (this.tick) clearInterval(this.tick);
    const ratio = this.okTotal() / (this.cfg.size * this.cfg.rounds);
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.4 ? 1 : 0;
    this.done.emit({ points: this.points(), stars, timeMs: Date.now() - this.started });
  }
}