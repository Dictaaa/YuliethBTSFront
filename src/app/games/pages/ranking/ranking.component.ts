import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { findGame } from '../../core/data/games.registry';
import { PlayerService } from '../../core/services/player.service';
import { ScoreService } from '../../core/services/score.service';
import { RankService } from '../../core/services/rank.service';
import { StreakService } from '../../core/services/streak.service';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { fmtShort } from '../../../core/utils/date.utils';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
})
export class RankingComponent {
  private player = inject(PlayerService);
  private streak = inject(StreakService);
  score = inject(ScoreService);
  rank = inject(RankService);

  list = this.score.ranking;
  fmt = fmtShort;

  title(id: string) { return findGame(id)?.title ?? id; }
  icon(id: string) { return findGame(id)?.icon ?? '🎮'; }

  medal(i: number) { return ['🥇', '🥈', '🥉'][i] ?? i + 1; }

  reset() {
    if (confirm('¿Borrar tu nombre, puntos y racha de este dispositivo?')) {
      this.score.reset();
      this.streak.reset();
      this.player.clear();
    }
  }
}