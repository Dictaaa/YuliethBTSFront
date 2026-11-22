import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, computed, inject, signal } from '@angular/core';
import { QUIZ } from '../../core/data/trivia.data';
import { Question } from '../../core/models/question.model';
import { PlayerService } from '../../core/services/player.service';
import { shuffle } from '../../core/utils/shuffle';
import { RIGHT, TIMEUP, WRONG, fill, pick } from '../../core/utils/messages';

const CFG: Record<number, { count: number; pts: number; time: number }> = {
  1: { count: 10, pts: 10, time: 0 },
  2: { count: 15, pts: 15, time: 0 },
  3: { count: 20, pts: 20, time: 20 }, // segundos por pregunta
};

@Component({
  selector: 'app-army-quiz',
  standalone: true,
  templateUrl: './army-quiz.component.html',
  styleUrl: './army-quiz.component.scss',
})
export class ArmyQuizComponent implements OnInit, OnDestroy {
  private player = inject(PlayerService);

  @Input() level = 1;
  @Output() done = new EventEmitter<{ points: number; stars: number; timeMs: number }>();

  letters = ['A', 'B', 'C', 'D'];
  cfg = CFG[1];

  questions = signal<Question[]>([]);
  idx = signal(0);
  picked = signal<string | null>(null);
  points = signal(0);
  correct = signal(0);
  streak = signal(0);
  feedback = signal('');
  lastOk = signal(false);
  left = signal(0);

  total = computed(() => this.questions().length);
  current = computed(() => this.questions()[this.idx()]);
  progress = computed(() => (this.total() ? (this.idx() / this.total()) * 100 : 0));
  isLast = computed(() => this.idx() >= this.total() - 1);

  private timer?: ReturnType<typeof setInterval>;
  private started = Date.now();

  ngOnInit() {
    this.cfg = CFG[this.level] ?? CFG[1];
    const pool = shuffle(QUIZ.filter((x) => x.level === this.level));
    this.questions.set(
      pool.slice(0, this.cfg.count).map((x) => ({ ...x, options: shuffle(x.options) }))
    );
    this.started = Date.now();
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  state(o: string): 'ok' | 'bad' | 'dim' | '' {
    const p = this.picked();
    if (p === null) return '';
    if (o === this.current().answer) return 'ok';
    return o === p ? 'bad' : 'dim';
  }

  answer(o: string) {
    if (this.picked() !== null) return;
    this.stopTimer();

    const q = this.current();
    const name = this.player.name();
    this.picked.set(o);

    if (o === q.answer) {
      const streak = this.streak() + 1;
      const combo = Math.min(10, (streak - 1) * 2);
      const speed = this.cfg.time ? Math.round((this.left() / this.cfg.time) * 10) : 0;
      const gain = this.cfg.pts + combo + speed;

      this.streak.set(streak);
      this.correct.update((c) => c + 1);
      this.points.update((p) => p + gain);
      this.lastOk.set(true);
      this.feedback.set(`${fill(pick(RIGHT), name)} +${gain} puntos`);
    } else {
      this.streak.set(0);
      this.lastOk.set(false);
      this.feedback.set(`${fill(pick(WRONG), name)} Era: ${q.answer}`);
    }
  }

  next() {
    if (this.isLast()) return this.finish();
    this.idx.update((i) => i + 1);
    this.picked.set(null);
    this.startTimer();
  }

  private timeout() {
    this.stopTimer();
    this.picked.set('⏰');
    this.streak.set(0);
    this.lastOk.set(false);
    this.feedback.set(`${fill(TIMEUP, this.player.name())} Era: ${this.current().answer}`);
  }

  private finish() {
    const ratio = this.total() ? this.correct() / this.total() : 0;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.75 ? 2 : ratio >= 0.5 ? 1 : 0;
    this.done.emit({ points: this.points(), stars, timeMs: Date.now() - this.started });
  }

  private startTimer() {
    this.stopTimer();
    if (!this.cfg.time) return;
    this.left.set(this.cfg.time);
    this.timer = setInterval(() => {
      const v = this.left() - 0.1;
      if (v <= 0) {
        this.left.set(0);
        this.timeout();
      } else {
        this.left.set(v);
      }
    }, 100);
  }

  private stopTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }
}