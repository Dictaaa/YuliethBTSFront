import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, of, shareReplay } from 'rxjs';
import { ALBUMS, Album } from '../data/music.data';

@Injectable({ providedIn: 'root' })
export class MusicService {
  private http = inject(HttpClient);

  albums$ = this.http.get<Album[]>('assets/data/bts/albums.json').pipe(
    map((l) => (l.length ? l : ALBUMS)),
    catchError(() => of(ALBUMS)),
    shareReplay(1)
  );
}