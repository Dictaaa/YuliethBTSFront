import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, of, shareReplay } from 'rxjs';
import { NewsItem } from '../models/news.model';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);

  news$ = this.http.get<NewsItem[]>('assets/data/bts/news.json').pipe(
    map((list) => [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))),
    catchError(() => of([] as NewsItem[])),
    shareReplay(1)
  );

  /** Candidatos a evento detectados por el bot: aún NO confirmados */
  pending$ = this.http.get<NewsItem[]>('assets/data/bts/events-pending.json').pipe(
    map((list) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return list
        .filter((e) => e.eventDate && new Date(e.eventDate + 'T12:00:00') >= today)
        .sort((a, b) => (a.eventDate ?? '').localeCompare(b.eventDate ?? ''));
    }),
    catchError(() => of([] as NewsItem[])),
    shareReplay(1)
  );
}