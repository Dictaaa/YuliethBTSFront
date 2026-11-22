import { Injectable, computed, inject, signal } from '@angular/core';
import { QUIZ } from '../data/trivia.data';
import { Question } from '../models/question.model';
import { load, save, today } from '../utils/storage';
import { mulberry32, shuffle } from '../utils/shuffle';
import { ScoreService } from './score.service';
import { StreakService } from './streak.service';

interface DailyState {
  date: string;
  done: boolean;
  correct: number;
  bonus: number;
}

const KEY = 'army.daily';

@Injectable({ providedIn: 'root' })
export class DailyService {
  private score = inject(ScoreService);
  private streak = inject(StreakService);

  state = signal<DailyState>(load(KEY, { date: '', done: false, correct: 0, bonus: 0 }));

  doneToday = computed(() => this.state().date === today() && this.state().done);
  bonusToday = computed(() => (this.doneToday() ? this.state().bonus : 0));

  /** Las mismas 3 preguntas (y el mismo orden de opciones) para todos ese día */
  questions(): Question[] {
    const rnd = mulberry32(Number(today().replace(/-/g, '')));
    return ([1, 2, 3] as const).map((lv) => {
      const q = shuffle(
        QUIZ.filter((x) => x.level === lv),
        rnd
      )[0];
      return { ...q, options: shuffle(q.options, rnd) };
    });
  }

  /** Guarda el resultado, suma el bono y cuenta el día para la racha. Devuelve los puntos ganados */
  complete(correct: number): number {
    if (this.doneToday()) return 0;
    const bonus = correct * 10 + (correct === 3 ? 10 : 0);
    const next: DailyState = { date: today(), done: true, correct, bonus };
    this.state.set(next);
    save(KEY, next);
    if (bonus) this.score.addBonus(bonus);
    this.streak.register();
    return bonus;
  }
}