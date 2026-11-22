import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GAMES } from '../../core/data/games.registry';
import { PlayerService } from '../../core/services/player.service';
import { ScoreService } from '../../core/services/score.service';
import { RankService } from '../../core/services/rank.service';
import { StreakService } from '../../core/services/streak.service';
import { NameGateComponent } from '../../ui/name-gate/name-gate.component';
import { GameCardComponent } from '../../ui/game-card/game-card.component';
import { SectionTitleComponent } from '../../../shared/section-title/section-title.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { DailyChallengeComponent } from '../../ui/daily-challenge/daily-challenge.component';
import { ShareService } from '../../core/services/share.service';

@Component({
  selector: 'app-games-hub',
  standalone: true,
  imports: [RouterLink, NameGateComponent, GameCardComponent, SectionTitleComponent, RevealDirective, DailyChallengeComponent],
  templateUrl: './games-hub.component.html',
  styleUrl: './games-hub.component.scss',
})
export class GamesHubComponent {
  player = inject(PlayerService);
  score = inject(ScoreService);
  rank = inject(RankService);
  streak = inject(StreakService);
  private sharer = inject(ShareService);
  shareMsg = signal('');
  games = GAMES;
  editing = signal(false);
  showGate = computed(() => !this.player.hasName() || this.editing());

  async share() {
    const res = await this.sharer.share({
      name: this.player.name(),
      rank: this.rank.current().label,
      rankIcon: this.rank.current().icon,
      total: this.score.total(),
      totalStars: this.score.totalStars(),
      streak: this.streak.current(),
    });
    this.shareMsg.set(res === 'shared' ? '¡Compartido! 💜' : res === 'downloaded' ? 'Imagen descargada 📥' : '');
  }
}