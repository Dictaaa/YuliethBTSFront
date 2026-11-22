import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { MEMBERS, Member } from '../../../core/data/bts.data';
import { PlayerService } from '../../core/services/player.service';
import { RIGHT, WRONG, fill, pick } from '../../core/utils/messages';
import { shuffle } from '../../core/utils/shuffle';

interface Quote {
  quote: string;
  member: string;
  source: string;
  url?: string;
  verified?: boolean;
}

interface Round {
  quote: Quote;
  member: Member;
  options: Member[];
}

const MIN = 5;
const MAX_ROUNDS = 10;

@Component({
  selector: 'app-who-said',
  standalone: true,
  templateUrl: './who-said.component.html',
  styleUrl: './who-said.component.scss',
})
export class WhoSaidComponent implements OnInit {
  private http = inject(HttpClient);
  private player = inject(PlayerService);

  @Output() done = new EventEmitter<{ points: number; stars: number; timeMs: number }>();

  letters = ['A', 'B', 'C', 'D'];
  loading = signal(true);
  notEnough = signal(false);
  rounds = signal<Round[]>([]);
  idx = signal(0);
  picked = signal<string | null>(null);
  points = signal(0);
  correct = signal(0);
  streak = signal(0);
  feedback = signal('');
  lastOk = signal(false);

  total = computed(() => this.rounds().length);
  current = computed(() => this.rounds()[this.idx()]);
  progress = computed(() => (this.total() ? (this.idx() / this.total()) * 100 : 0));
  isLast = computed(() => this.idx() >= this.total() - 1);

  private started = Date.now();

  ngOnInit() {
    this.http
      .get<Quote[]>('assets/data/bts/quotes.json')
      .pipe(catchError(() => of([] as Quote[])))
      .subscribe((list) => {
        const ok = list.filter(
          (q) => q.verified === true && !!q.quote && !!q.source && MEMBERS.some((m) => m.id === q.member)
        );

        if (ok.length < MIN) {
          this.notEnough.set(true);
        } else {
          this.rounds.set(
            shuffle(ok)
              .slice(0, MAX_ROUNDS)
              .map((q) => {
                const member = MEMBERS.find((m) => m.id === q.member)!;
                const others = shuffle(MEMBERS.filter((m) => m.id !== member.id)).slice(0, 3);
                return { quote: q, member, options: shuffle([member, ...others]) };
              })
          );
          this.started = Date.now();
        }
        this.loading.set(false);
      });
  }

  state(o: Member): 'ok' | 'bad' | 'dim' | '' {
    const p = this.picked();
    if (p === null) return '';
    if (o.id === this.current().member.id) return 'ok';
    return o.id === p ? 'bad' : 'dim';
  }

  choose(o: Member) {
    if (this.picked() !== null) return;
    const r = this.current();
    const name = this.player.name();
    this.picked.set(o.id);

    if (o.id === r.member.id) {
      const streak = this.streak() + 1;
      const gain = 20 + Math.min(10, (streak - 1) * 2);
      this.streak.set(streak);
      this.correct.update((c) => c + 1);
      this.points.update((p) => p + gain);
      this.lastOk.set(true);
      this.feedback.set(`${fill(pick(RIGHT), name)} Lo dijo ${r.member.stage}. +${gain} puntos`);
    } else {
      this.streak.set(0);
      this.lastOk.set(false);
      this.feedback.set(`${fill(pick(WRONG), name)} Lo dijo ${r.member.stage}`);
    }
  }

  next() {
    if (this.isLast()) return this.finish();
    this.idx.update((i) => i + 1);
    this.picked.set(null);
  }

  private finish() {
    const ratio = this.total() ? this.correct() / this.total() : 0;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.75 ? 2 : ratio >= 0.5 ? 1 : 0;
    this.done.emit({ points: this.points(), stars, timeMs: Date.now() - this.started });
  }
}