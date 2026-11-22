import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject, signal } from '@angular/core';
import { PlayerService } from '../../core/services/player.service';

@Component({
  selector: 'app-name-gate',
  standalone: true,
  template: `
    <div class="ng" role="dialog" aria-modal="true" aria-labelledby="ng-title">
      <div class="ng__box">
        <div class="ng__orb">💜</div>
        <h2 id="ng-title">{{ cancellable ? 'Cambiar nombre' : '¡Hola, ARMY!' }}</h2>
        <p>Antes de jugar, ¿cómo te llamas? Así podré felicitarte por tu nombre.</p>

        <input
          #inp
          type="text"
          maxlength="20"
          placeholder="Tu nombre"
          autocomplete="given-name"
          [value]="draft()"
          (input)="draft.set($any($event.target).value); error.set(false)"
          (keydown.enter)="save()"
        />
        @if (error()) {
          <small class="ng__err">Escribe tu nombre para continuar 💜</small>
        }

        <div class="ng__btns">
          @if (cancellable) {
            <button class="ghost" (click)="dismissed.emit()">Cancelar</button>
          }
          <button class="main" (click)="save()">Empezar 💜</button>
        </div>
        <small class="ng__note">Tu nombre se guarda solo en este dispositivo.</small>
      </div>
    </div>
  `,
  styleUrl: './name-gate.component.scss',
})
export class NameGateComponent implements AfterViewInit {
  private player = inject(PlayerService);

  @Input() cancellable = false;
  @Output() done = new EventEmitter<void>();
  @Output() dismissed = new EventEmitter<void>();
  @ViewChild('inp') inp?: ElementRef<HTMLInputElement>;

  draft = signal(this.player.name());
  error = signal(false);

  ngAfterViewInit() {
    setTimeout(() => this.inp?.nativeElement.focus());
  }

  save() {
    if (this.player.set(this.draft())) this.done.emit();
    else this.error.set(true);
  }
}