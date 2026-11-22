import { Component, EventEmitter, OnDestroy, OnInit, Output, computed, inject, signal } from '@angular/core';
import { MEMBERS } from '../../../core/data/bts.data';
import { PERSONALITY, PROFILES } from '../../core/data/personality.data';
import { PlayerService } from '../../core/services/player.service';
import { shuffle } from '../../core/utils/shuffle';

@Component({
  selector: 'app-bestfriend-test',
  standalone: true,
  templateUrl: './bestfriend-test.component.html',
  styleUrl: './bestfriend-test.component.scss',
})
export class BestfriendTestComponent implements OnInit, OnDestroy {
  private player = inject(PlayerService);

  @Output() done = new EventEmitter<{ points: number; stars: number; timeMs: number }>();

  questions = PERSONALITY;
  idx = signal(0);
  chosen = signal<number | null>(null);
  scores = signal<Record<string, number>>({});
  finished = signal(false);
  photoOk = signal(true);

  total = this.questions.length;
  current = computed(() => this.questions[this.idx()]);
  progress = computed(() => (this.idx() / this.total) * 100);

  /** Todos los integrantes ordenados por afinidad (el desempate es al azar) */
  ranking = computed(() => {
    const s = this.scores();
    return shuffle(MEMBERS)
      .map((m) => ({ m, score: s[m.id] ?? 0 }))
      .sort((a, b) => b.score - a.score);
  });

  top = computed(() => this.ranking()[0]);
  profile = computed(() => PROFILES[this.top().m.id] ?? '');
  message = computed(() => `${this.player.name() || 'ARMY'}, tu mejor amigo sería ${this.top().m.stage} 💜`);

  private started = Date.now();
  private timer?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.started = Date.now();
  }

  ngOnDestroy() {
    if (this.timer) clearTimeout(this.timer);
  }

  pct(score: number): number {
    const max = this.top().score || 1;
    return Math.round((score / max) * 100);
  }

  choose(i: number) {
    if (this.chosen() !== null) return;
    this.chosen.set(i);

    const s = { ...this.scores() };
    this.current().options[i].w.forEach((id, k) => {
      s[id] = (s[id] ?? 0) + (k === 0 ? 2 : 1);
    });
    this.scores.set(s);

    this.timer = setTimeout(() => {
      if (this.idx() >= this.total - 1) {
        this.finished.set(true);
      } else {
        this.idx.update((n) => n + 1);
        this.chosen.set(null);
      }
    }, 450);
  }

  finish() {
    // Completar el test da 100 puntos y 3 estrellas
    this.done.emit({ points: 100, stars: 3, timeMs: Date.now() - this.started });
  }
}