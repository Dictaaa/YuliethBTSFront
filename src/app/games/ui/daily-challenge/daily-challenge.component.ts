import { Component, computed, inject, signal } from '@angular/core';
import { Question } from '../../core/models/question.model';
import { DailyService } from '../../core/services/daily.service';
import { PlayerService } from '../../core/services/player.service';
import { RIGHT, WRONG, fill, pick } from '../../core/utils/messages';

@Component({
  selector: 'app-daily-challenge',
  standalone: true,
  templateUrl: './daily-challenge.component.html',
  styleUrl: './daily-challenge.component.scss',
})
export class DailyChallengeComponent {
  daily = inject(DailyService);
  player = inject(PlayerService);

  letters = ['A', 'B', 'C', 'D'];
  open = signal(false);
  qs = signal<Question[]>([]);
  idx = signal(0);
  picked = signal<string | null>(null);
  correct = signal(0);
  feedback = signal('');
  lastOk = signal(false);
  finished = signal(false);
  gained = signal(0);

  current = computed(() => this.qs()[this.idx()]);
  isLast = computed(() => this.idx() >= this.qs().length - 1);

  start() {
    this.qs.set(this.daily.questions());
    this.idx.set(0);
    this.picked.set(null);
    this.correct.set(0);
    this.finished.set(false);
    this.open.set(true);
  }

  state(o: string): 'ok' | 'bad' | 'dim' | '' {
    const p = this.picked();
    if (p === null) return '';
    if (o === this.current().answer) return 'ok';
    return o === p ? 'bad' : 'dim';
  }

  answer(o: string) {
    if (this.picked() !== null) return;
    const name = this.player.name();
    this.picked.set(o);

    if (o === this.current().answer) {
      this.correct.update((c) => c + 1);
      this.lastOk.set(true);
      this.feedback.set(fill(pick(RIGHT), name));
    } else {
      this.lastOk.set(false);
      this.feedback.set(`${fill(pick(WRONG), name)} Era: ${this.current().answer}`);
    }
  }

  next() {
    if (this.isLast()) {
      this.gained.set(this.daily.complete(this.correct()));
      this.finished.set(true);
      return;
    }
    this.idx.update((i) => i + 1);
    this.picked.set(null);
  }
}