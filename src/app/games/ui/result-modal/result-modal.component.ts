import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResultView } from '../../core/models/game.model';

@Component({
  selector: 'app-result-modal',
  standalone: true,
  template: `
    <div class="rm" role="dialog" aria-modal="true">
      @if (data.stars > 0) {
        <div class="rm__confetti" aria-hidden="true">
          @for (b of bits; track b.id) {
            <span [style.left.%]="b.left" [style.animation-delay.s]="b.delay"
                  [style.animation-duration.s]="b.dur" [style.font-size.px]="b.size">{{ b.s }}</span>
          }
        </div>
      }

      <div class="rm__box">
        <h2>{{ data.stars > 0 ? '¡Nivel superado!' : 'Casi lo logras' }}</h2>
        <p class="rm__msg">{{ data.message }}</p>

        <div class="rm__stars">
          @for (s of three; track s) {
            <i [class.on]="data.stars >= s" [style.animation-delay.s]="s * 0.25">★</i>
          }
        </div>

        <p class="rm__pts">
          <strong>{{ data.points }}</strong> puntos
          @if (data.newBest) { <span class="rm__best">¡Nuevo récord!</span> }
        </p>

        @if (data.rankUp) { <p class="rm__rank">🎉 {{ data.rankUp }}</p> }

        <div class="rm__btns">
          <button (click)="retry.emit()">Jugar otra vez</button>
          <button (click)="share.emit()">Compartir</button>
          @if (data.hasNext) {
            <button class="main" (click)="next.emit()">Siguiente nivel →</button>
          }
          <button (click)="exit.emit()">Salir</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './result-modal.component.scss',
})
export class ResultModalComponent {
  @Input({ required: true }) data!: ResultView;
  @Output() retry = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() exit = new EventEmitter<void>();
  @Output() share = new EventEmitter<void>();

  three = [1, 2, 3];
  bits = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    s: ['💜', '✨', '🎵', '⭐', '💖'][i % 5],
    left: (i * 37) % 100,
    delay: (i % 7) * 0.15,
    dur: 2.6 + (i % 4) * 0.6,
    size: 16 + (i % 3) * 8,
  }));
}