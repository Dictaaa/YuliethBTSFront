import { Component, EventEmitter, Input, OnInit, Output, computed, inject, signal } from '@angular/core';
import { MEMBERS, Member } from '../../../core/data/bts.data';
import { WHO_CLUES } from '../../core/data/who-is.data';
import { PlayerService } from '../../core/services/player.service';
import { RIGHT, WRONG, fill, pick } from '../../core/utils/messages';
import { shuffle } from '../../core/utils/shuffle';

interface Round {
  member: Member;
  clues: string[];
  options: Member[];
}

type PhotoMode = 'show' | 'silhouette' | 'none';

const CFG: Record<number, { count: number; pts: number; clues: number; photo: PhotoMode; opts: number }> = {
  1: { count: 10, pts: 10, clues: 3, photo: 'show', opts: 4 },
  2: { count: 10, pts: 15, clues: 1, photo: 'silhouette', opts: 4 },
  3: { count: 10, pts: 25, clues: 1, photo: 'none', opts: 7 },
};

@Component({
  selector: 'app-who-is',
  standalone: true,
  templateUrl: './who-is.component.html',
  styleUrl: './who-is.component.scss',
})
export class WhoIsComponent implements OnInit {
  private player = inject(PlayerService);

  @Input() level = 1;
  @Output() done = new EventEmitter<{ points: number; stars: number; timeMs: number }>();

  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  cfg = CFG[1];

  rounds = signal<Round[]>([]);
  idx = signal(0);
  picked = signal<string | null>(null);
  photoOk = signal(true);
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
    this.cfg = CFG[this.level] ?? CFG[1];
    const seq = [...shuffle(MEMBERS), ...shuffle(MEMBERS)].slice(0, this.cfg.count);

    this.rounds.set(
      seq.map((m) => {
        const clues =
          this.level === 3
            ? [`Su nombre real es ${m.real}.`]
            : shuffle(WHO_CLUES[m.id] ?? []).slice(0, this.cfg.clues);
        const others = shuffle(MEMBERS.filter((x) => x.id !== m.id)).slice(0, this.cfg.opts - 1);
        return { member: m, clues, options: shuffle([m, ...others]) };
      })
    );
    this.started = Date.now();
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
      const combo = Math.min(10, (streak - 1) * 2);
      const gain = this.cfg.pts + combo;

      this.streak.set(streak);
      this.correct.update((c) => c + 1);
      this.points.update((p) => p + gain);
      this.lastOk.set(true);
      this.feedback.set(`${fill(pick(RIGHT), name)} Es ${r.member.stage}. +${gain} puntos`);
    } else {
      this.streak.set(0);
      this.lastOk.set(false);
      this.feedback.set(`${fill(pick(WRONG), name)} Era ${r.member.stage}`);
    }
  }

  next() {
    if (this.isLast()) return this.finish();
    this.idx.update((i) => i + 1);
    this.picked.set(null);
    this.photoOk.set(true);
  }

  private finish() {
    const ratio = this.total() ? this.correct() / this.total() : 0;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.75 ? 2 : ratio >= 0.5 ? 1 : 0;
    this.done.emit({ points: this.points(), stars, timeMs: Date.now() - this.started });
  }
}