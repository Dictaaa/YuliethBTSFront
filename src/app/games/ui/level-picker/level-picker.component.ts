import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { GameDef } from '../../core/models/game.model';
import { ScoreService } from '../../core/services/score.service';

@Component({
  selector: 'app-level-picker',
  standalone: true,
  template: `
    <div class="lp">
      @for (l of game.levels; track l.n) {
        <button
          class="lv"
          [class.lv--locked]="!score.unlocked(game.id, l.n)"
          [disabled]="!score.unlocked(game.id, l.n)"
          (click)="pick.emit(l.n)"
        >
          <span class="lv__n">{{ score.unlocked(game.id, l.n) ? l.n : '🔒' }}</span>
          <span class="lv__body">
            <strong>{{ l.name }}</strong>
            <small>{{ l.desc }}</small>
            @if (score.rec(game.id, l.n); as r) {
              <small class="lv__best">Mejor: {{ r.points }} pts</small>
            } @else if (!score.unlocked(game.id, l.n)) {
              <small class="lv__best">Saca 1 ★ en el nivel anterior</small>
            }
          </span>
          <span class="lv__stars">
            @for (s of three; track s) {
              <i [class.on]="score.stars(game.id, l.n) >= s">★</i>
            }
          </span>
        </button>
      }
    </div>
  `,
  styleUrl: './level-picker.component.scss',
})
export class LevelPickerComponent {
  score = inject(ScoreService);
  three = [1, 2, 3];

  @Input({ required: true }) game!: GameDef;
  @Output() pick = new EventEmitter<number>();
}