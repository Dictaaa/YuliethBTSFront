import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameDef } from '../../core/models/game.model';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a class="gc" [routerLink]="['/juegos', game.id]">
      <span class="gc__tag" [class.gc__tag--soon]="game.soon">{{ game.tag }}</span>
      <span class="gc__icon">{{ game.icon }}</span>
      <h3>{{ game.title }}</h3>
      <p>{{ game.desc }}</p>
      <span class="gc__foot">
        <span>🎚️ {{ game.levels.length }} {{ game.levels.length === 1 ? 'nivel' : 'niveles' }}</span>
        <span class="gc__stars">⭐ {{ stars }}/{{ game.levels.length * 3 }}</span>
      </span>
    </a>
  `,
  styleUrl: './game-card.component.scss',
})
export class GameCardComponent {
  @Input({ required: true }) game!: GameDef;
  @Input() stars = 0;
}