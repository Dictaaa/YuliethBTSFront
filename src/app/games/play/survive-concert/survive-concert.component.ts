import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { EVENTS, Fx, Opt, STAT_LABELS, STEPS, StatKey } from '../../core/data/survive.data';
import { PlayerService } from '../../core/services/player.service';
import { fill } from '../../core/utils/messages';

interface LogItem {
  icon: string;
  title: string;
  ok: boolean;
  text: string;
}

const START = 4;
const MAX = 10;

@Component({
  selector: 'app-survive-concert',
  standalone: true,
  templateUrl: './survive-concert.component.html',
  styleUrl: './survive-concert.component.scss',
})
export class SurviveConcertComponent implements OnInit {
  private player = inject(PlayerService);

  @Output() done = new EventEmitter<{ points: number; stars: number; timeMs: number }>();

  steps = STEPS;
  keys: StatKey[] = ['energy', 'budget', 'mood', 'prep'];
  labels = STAT_LABELS;

  stats = signal<Record<StatKey, number>>({ energy: START, budget: START, mood: START, prep: START });
  idx = signal(0);
  selected = signal<string[]>([]);
  confirmed = signal(false);
  feedback = signal('');
  bag = signal<string[]>([]);
  log = signal<LogItem[]>([]);
  summary = signal(false);

  current = computed(() => this.steps[this.idx()]);
  isLast = computed(() => this.idx() >= this.steps.length - 1);
  progress = computed(() => (this.idx() / this.steps.length) * 100);
  total = computed(() => this.keys.reduce((s, k) => s + this.stats()[k], 0));
  collapsed = computed(() => this.keys.some((k) => this.stats()[k] <= 0));

  verdict = computed(() => {
    const n = this.player.name() || 'ARMY';
    if (this.collapsed()) return `Uy, ${n}: terminaste sin fuerzas. La próxima vez cuida mejor tus recursos 💜`;
    if (this.total() >= 28) return `¡Eres una ARMY de concierto, ${n}! Todo salió increíble 🎉`;
    if (this.total() >= 24) return `¡Excelente, ${n}! Pasaste un día de concierto muy bueno 💜`;
    return `Sobreviviste, ${n}. ¡Y con muy buenos recuerdos! ✨`;
  });

  private started = Date.now();

  ngOnInit() {
    this.started = Date.now();
  }

  isSel(o: Opt) { return this.selected().includes(o.id); }

  choose(o: Opt) {
    if (this.confirmed()) return;
    this.selected.set([o.id]);
    this.apply(o.fx);
    this.confirmed.set(true);
    this.feedback.set(`${fill(o.tip, this.player.name())} (${this.delta(o.fx)})`);
  }

  toggle(o: Opt) {
    if (this.confirmed()) return;
    const max = this.current().multi ?? 1;
    const sel = this.selected();
    if (sel.includes(o.id)) this.selected.set(sel.filter((x) => x !== o.id));
    else if (sel.length < max) this.selected.set([...sel, o.id]);
  }

  confirmMulti() {
    const sel = this.selected();
    if (this.confirmed() || !sel.length) return;
    const chosen = this.current().options.filter((o) => sel.includes(o.id));
    const fx: Fx = {};
    chosen.forEach((o) => this.merge(fx, o.fx));
    this.apply(fx);
    this.bag.set(sel);
    this.confirmed.set(true);
    this.feedback.set(`Llevas ${sel.length} ${sel.length === 1 ? 'cosa' : 'cosas'}, ${this.player.name() || 'ARMY'} (${this.delta(fx)}). Veremos qué pasa el día del concierto…`);
  }

  next() {
    if (this.isLast()) return this.endDay();
    this.idx.update((i) => i + 1);
    this.selected.set([]);
    this.confirmed.set(false);
    this.feedback.set('');
  }

  finish() {
    const t = this.total();
    const points = this.collapsed() ? t * 2 : t * 4;
    const stars = this.collapsed() ? 0 : t >= 28 ? 3 : t >= 24 ? 2 : 1;
    this.done.emit({ points, stars, timeMs: Date.now() - this.started });
  }

  pct(k: StatKey) { return (this.stats()[k] / MAX) * 100; }

  private endDay() {
    const bag = this.bag();
    const log: LogItem[] = EVENTS.map((e) => {
      const ok = e.need.some((id) => bag.includes(id));
      if (!ok) this.apply(e.failFx);
      return { icon: e.icon, title: e.title, ok, text: ok ? e.ok : e.fail };
    });
    this.log.set(log);
    this.summary.set(true);
  }

  private merge(into: Fx, add: Fx) {
    (Object.keys(add) as StatKey[]).forEach((k) => (into[k] = (into[k] ?? 0) + (add[k] ?? 0)));
  }

  private apply(fx: Fx) {
    const s = { ...this.stats() };
    (Object.keys(fx) as StatKey[]).forEach((k) => {
      s[k] = Math.min(MAX, Math.max(0, s[k] + (fx[k] ?? 0)));
    });
    this.stats.set(s);
  }

  private delta(fx: Fx): string {
    return (Object.keys(fx) as StatKey[])
      .filter((k) => fx[k])
      .map((k) => `${this.labels[k]} ${fx[k]! > 0 ? '+' : ''}${fx[k]}`)
      .join(' · ');
  }
}