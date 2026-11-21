import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { EventItem } from '../models/event.model';

const RECURRING = [
  { key: 'army', title: 'Cumpleaños de ARMY', month: 7, day: 9, icon: '💜' },
  { key: 'debut', title: 'Aniversario de debut de BTS', month: 6, day: 13, icon: '🎤' },
  { key: 'jhope', title: 'Cumpleaños de J-Hope', month: 2, day: 18, icon: '🎂' },
  { key: 'suga', title: 'Cumpleaños de Suga', month: 3, day: 9, icon: '🎂' },
  { key: 'jungkook', title: 'Cumpleaños de Jung Kook', month: 9, day: 1, icon: '🎂' },
  { key: 'rm', title: 'Cumpleaños de RM', month: 9, day: 12, icon: '🎂' },
  { key: 'jimin', title: 'Cumpleaños de Jimin', month: 10, day: 13, icon: '🎂' },
  { key: 'jin', title: 'Cumpleaños de Jin', month: 12, day: 4, icon: '🎂' },
  { key: 'v', title: 'Cumpleaños de V', month: 12, day: 30, icon: '🎂' },
];

function nextOccurrence(month: number, day: number): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(today.getFullYear(), month - 1, day);
  if (d < today) d.setFullYear(d.getFullYear() + 1);
  return d;
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  private http = inject(HttpClient);

  private manual$ = this.http
    .get<EventItem[]>('assets/data/events.json')
    .pipe(catchError(() => of([] as EventItem[])));

  private recurring(): EventItem[] {
    return RECURRING.map((r) => ({
      id: 'rec-' + r.key,
      title: r.title,
      date: nextOccurrence(r.month, r.day).toISOString(),
      type: 'especial' as const,
      icon: r.icon,
    }));
  }

  /** Próximos eventos (manuales + fechas fijas), ordenados por fecha */
  upcoming$ = this.manual$.pipe(
    map((manual) => {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      return [...manual, ...this.recurring()]
        .filter((e) => new Date(e.date) >= startOfToday)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    })
  );
}