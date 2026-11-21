import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventsService } from '../../core/services/events.service';
import { EventType } from '../../core/models/event.model';
import { CountdownComponent } from '../../shared/countdown/countdown.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { daysLeft, fmtDate } from '../../core/utils/date.utils';
import { NewsService } from '../../core/services/news.service';
import { fmtShort } from '../../core/utils/date.utils';
import { NewsCardComponent } from '../../shared/news-card/news-card.component';
import { map } from 'rxjs';

type Filter = 'todos' | EventType;

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CountdownComponent, RevealDirective, NewsCardComponent],
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

  private newsSvc = inject(NewsService);
pending = toSignal(this.newsSvc.pending$, { initialValue: [] });
short = fmtShort;

concertNews = toSignal(
  this.newsSvc.news$.pipe(map((l) => l.filter((n) => n.category === 'concert').slice(0, 6))),
  { initialValue: [] }
);
}