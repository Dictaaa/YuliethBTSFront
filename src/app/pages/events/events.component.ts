import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventsService } from '../../core/services/events.service';
import { EventType } from '../../core/models/event.model';
import { CountdownComponent } from '../../shared/countdown/countdown.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { daysLeft, fmtDate } from '../../core/utils/date.utils';

type Filter = 'todos' | EventType;

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CountdownComponent, RevealDirective],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  private svc = inject(EventsService);

  events = toSignal(this.svc.upcoming$, { initialValue: [] });
  filter = signal<Filter>('todos');

  filters: { key: Filter; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'concierto', label: '🎤 Conciertos' },
    { key: 'lanzamiento', label: '💿 Lanzamientos' },
    { key: 'especial', label: '💜 Fechas especiales' },
  ];

  next = computed(() => this.events()[0]);
  list = computed(() => {
    const f = this.filter();
    return this.events().filter((e) => f === 'todos' || e.type === f);
  });

  fmt = fmtDate;
  days = daysLeft;
}