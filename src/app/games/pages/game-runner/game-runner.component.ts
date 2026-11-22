import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { findGame } from '../../core/data/games.registry';
import { ResultView, Stars } from '../../core/models/game.model';
import { PlayerService } from '../../core/services/player.service';
import { ScoreService } from '../../core/services/score.service';
import { RankService } from '../../core/services/rank.service';
import { StreakService } from '../../core/services/streak.service';
import { NameGateComponent } from '../../ui/name-gate/name-gate.component';
import { LevelPickerComponent } from '../../ui/level-picker/level-picker.component';
import { ResultModalComponent } from '../../ui/result-modal/result-modal.component';
import { ArmyQuizComponent } from '../../play/army-quiz/army-quiz.component';
import { EmojiSongComponent } from '../../play/emoji-song/emoji-song.component';
import { GuessSongComponent } from '../../play/guess-song/guess-song.component';
import { WhoIsComponent } from '../../play/who-is/who-is.component';
import { BestfriendTestComponent } from '../../play/bestfriend-test/bestfriend-test.component';
import { MemoryComponent } from '../../play/memory/memory.component';
import { SortAlbumsComponent } from '../../play/sort-albums/sort-albums.component';
import { WordSearchComponent } from '../../play/word-search/word-search.component';
import { SurviveConcertComponent } from '../../play/survive-concert/survive-concert.component';
import { WhoSaidComponent } from '../../play/who-said/who-said.component';
import { ShareService } from '../../core/services/share.service';

@Component({
  selector: 'app-game-runner',
  standalone: true,
  imports: [RouterLink, NameGateComponent, LevelPickerComponent, ResultModalComponent, ArmyQuizComponent, EmojiSongComponent, GuessSongComponent, WhoIsComponent, BestfriendTestComponent, MemoryComponent, SortAlbumsComponent, WordSearchComponent, SurviveConcertComponent, WhoSaidComponent],
  templateUrl: './game-runner.component.html',
  styleUrl: './game-runner.component.scss',
})
export class GameRunnerComponent {
  private route = inject(ActivatedRoute);
  player = inject(PlayerService);
  private score = inject(ScoreService);
  private rank = inject(RankService);
  private streak = inject(StreakService);
  private sharer = inject(ShareService);

  run = signal(0);

  id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), { initialValue: '' });
  game = computed(() => findGame(this.id()));

  level = signal<number | null>(null);
  result = signal<ResultView | null>(null);

  start(n: number) {
    const g = this.game();
    if (!g || !this.score.unlocked(g.id, n)) return;
    this.result.set(null);
    this.run.update((r) => r + 1);
    this.level.set(n);
  }

  /** Cada juego llamará a este método al terminar (desde el paso 2) */
  finish(raw: { points: number; stars: number; timeMs?: number }) {
    const g = this.game();
    const lv = this.level();
    if (!g || lv === null) return;

    const rankBefore = this.rank.current().key;
    const stars = Math.min(3, Math.max(0, Math.round(raw.stars))) as Stars;
    const out = this.score.submit({
      gameId: g.id,
      level: lv,
      points: Math.max(0, Math.round(raw.points)),
      stars,
      timeMs: raw.timeMs,
    });
    this.streak.register();

    const after = this.rank.current();
    this.result.set({
      points: Math.max(0, Math.round(raw.points)),
      stars,
      newBest: out.newBest,
      message: this.player.say(stars >= 1 ? 'win' : 'try'),
      rankUp: after.key !== rankBefore ? `¡Subiste a ${after.label}!` : null,
      hasNext: stars >= 1 && lv < g.levels.length,
    });
  }

  retry() {
    this.result.set(null);
    this.run.update((r) => r + 1);
  }

  next() {
    const lv = this.level();
    this.result.set(null);
    this.run.update((r) => r + 1);
    if (lv !== null) this.level.set(lv + 1);
  }

  exit() {
    this.result.set(null);
    this.level.set(null);
  }

  /** SOLO PARA PROBAR el sistema: se borra en el paso 2 */
  simulate() {
    const stars = Math.floor(Math.random() * 4);
    this.finish({ points: stars * 100 + Math.floor(Math.random() * 60), stars });
  }

  async share() {
  const g = this.game();
  const r = this.result();
  if (!g || !r) return;
  await this.sharer.share({
    name: this.player.name(),
    rank: this.rank.current().label,
    rankIcon: this.rank.current().icon,
    total: this.score.total(),
    totalStars: this.score.totalStars(),
    streak: this.streak.current(),
    game: g.title,
    points: r.points,
    levelStars: r.stars,
  });
}
}