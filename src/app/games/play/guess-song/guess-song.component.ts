import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, computed, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import { MusicService } from '../../../core/services/music.service';
import { PlayerService } from '../../core/services/player.service';
import { RIGHT, WRONG, fill, pick } from '../../core/utils/messages';
import { shuffle } from '../../core/utils/shuffle';

interface Round {
  title: string;
  artist: string;
  preview: string;
  options: string[];
}

const CFG: Record<number, { rounds: number; clips: number[]; pts: number[] }> = {
  1: { rounds: 8, clips: [5, 10, 20], pts: [20, 14, 8] },
  2: { rounds: 8, clips: [4, 8], pts: [28, 18] },
  3: { rounds: 8, clips: [3], pts: [40] },
};

// Quita versiones instrumentales, remixes y repetidas
const SKIP = /instrumental|inst\.|remix|ver\.|version|sped up|speed up|acoustic/i;
const norm = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

@Component({
  selector: 'app-guess-song',
  standalone: true,
  templateUrl: './guess-song.component.html',
  styleUrl: './guess-song.component.scss',
})
export class GuessSongComponent implements OnInit, OnDestroy {
  private player = inject(PlayerService);
  private music = inject(MusicService);

  @Input() level = 1;
  @Output() done = new EventEmitter<{ points: number; stars: number; timeMs: number }>();

  letters = ['A', 'B', 'C', 'D'];
  cfg = CFG[1];

  loading = signal(true);
  noData = signal(false);
  rounds = signal<Round[]>([]);
  idx = signal(0);
  clue = signal(0);
  wrong = signal<string[]>([]);
  picked = signal<string | null>(null);
  playing = signal(false);
  clipSecs = signal(0);
  points = signal(0);
  correct = signal(0);
  streak = signal(0);
  feedback = signal('');
  lastOk = signal(false);

  total = computed(() => this.rounds().length);
  current = computed(() => this.rounds()[this.idx()]);
  progress = computed(() => (this.total() ? (this.idx() / this.total()) * 100 : 0));
  isLast = computed(() => this.idx() >= this.total() - 1);
  pips = computed(() => this.cfg.clips.map((_, i) => i));
  canMore = computed(() => this.picked() === null && this.clue() < this.cfg.clips.length - 1);

  private audio = new Audio();
  private loadedUrl = '';
  private stopTimer?: ReturnType<typeof setTimeout>;
  private started = Date.now();

  ngOnInit() {
    this.cfg = CFG[this.level] ?? CFG[1];

    this.music.albums$.pipe(take(1)).subscribe((albums) => {
      const seen = new Set<string>();
      const pool: { title: string; artist: string; preview: string }[] = [];

      for (const a of albums) {
        for (const t of a.tracks ?? []) {
          const n = norm(t.name);
          if (!t.preview || SKIP.test(t.name) || seen.has(n)) continue;
          seen.add(n);
          pool.push({ title: t.name, artist: a.artist, preview: t.preview });
        }
      }

      if (pool.length < 12) {
        this.noData.set(true);
      } else {
        this.rounds.set(
          shuffle(pool)
            .slice(0, this.cfg.rounds)
            .map((x) => ({
              ...x,
              options: shuffle([x.title, ...shuffle(pool.filter((p) => p.title !== x.title)).slice(0, 3).map((p) => p.title)]),
            }))
        );
        this.started = Date.now();
      }
      this.loading.set(false);
    });

    this.audio.addEventListener('ended', () => this.playing.set(false));
  }

  ngOnDestroy() {
    this.stopAudio();
    this.audio.src = '';
  }

  play() {
    const r = this.current();
    if (!r) return;
    this.stopAudio();

    if (this.loadedUrl !== r.preview) {
      this.audio.src = r.preview;
      this.loadedUrl = r.preview;
    } else {
      this.audio.currentTime = 0;
    }

    const secs = this.cfg.clips[this.clue()];
    this.audio
      .play()
      .then(() => {
        this.clipSecs.set(secs);
        this.playing.set(true);
        this.stopTimer = setTimeout(() => this.stopAudio(), secs * 1000);
      })
      .catch(() => this.playing.set(false));
  }

  more() {
    if (!this.canMore()) return;
    this.clue.update((c) => c + 1);
    this.play();
  }

  state(o: string): 'ok' | 'bad' | 'dim' | '' {
    const p = this.picked();
    if (p === null) return this.wrong().includes(o) ? 'bad' : '';
    if (o === this.current().title) return 'ok';
    return o === p || this.wrong().includes(o) ? 'bad' : 'dim';
  }

  choose(o: string) {
    if (this.picked() !== null || this.wrong().includes(o)) return;
    const r = this.current();
    const name = this.player.name();

    if (o === r.title) {
      this.stopAudio();
      const streak = this.streak() + 1;
      const combo = Math.min(10, (streak - 1) * 2);
      const gain = this.cfg.pts[this.clue()] + combo;

      this.picked.set(o);
      this.streak.set(streak);
      this.correct.update((c) => c + 1);
      this.points.update((p) => p + gain);
      this.lastOk.set(true);
      this.feedback.set(`${fill(pick(RIGHT), name)} +${gain} puntos · ${r.title} (${r.artist})`);
      return;
    }

    this.wrong.update((w) => [...w, o]);
    this.streak.set(0);

    if (this.clue() < this.cfg.clips.length - 1) {
      this.clue.update((c) => c + 1);
      this.play(); // fragmento más largo
    } else {
      this.stopAudio();
      this.picked.set(o);
      this.lastOk.set(false);
      this.feedback.set(`${fill(pick(WRONG), name)} Era: ${r.title} (${r.artist})`);
    }
  }

  next() {
    if (this.isLast()) return this.finish();
    this.stopAudio();
    this.idx.update((i) => i + 1);
    this.clue.set(0);
    this.wrong.set([]);
    this.picked.set(null);
  }

  private stopAudio() {
    if (this.stopTimer) clearTimeout(this.stopTimer);
    this.stopTimer = undefined;
    this.audio.pause();
    this.playing.set(false);
  }

  private finish() {
    this.stopAudio();
    const ratio = this.total() ? this.correct() / this.total() : 0;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.75 ? 2 : ratio >= 0.5 ? 1 : 0;
    this.done.emit({ points: this.points(), stars, timeMs: Date.now() - this.started });
  }
}