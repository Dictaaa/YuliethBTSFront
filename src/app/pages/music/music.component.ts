import { Component, computed, signal } from '@angular/core';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ALBUMS, Album } from '../../core/data/music.data';

type Filter = 'todos' | 'grupo' | 'solo';

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section class="container">
      <header class="page-head">
        <h1 appReveal="up">Música de BTS 🎵</h1>
        <p appReveal="up" [revealDelay]="150">
          Álbumes del grupo y proyectos de cada integrante. Toca una canción para buscarla en YouTube.
        </p>
      </header>

      <div class="chips" appReveal="fade">
        @for (f of filters; track f.key) {
          <button [class.on]="filter() === f.key" (click)="filter.set(f.key)">{{ f.label }}</button>
        }
      </div>

      <div class="albums">
        @for (a of list(); track a.id; let i = $index) {
          <article class="album" appReveal="up" [revealDelay]="(i % 3) * 120">
            <div class="album__cover">
              <span>💿</span>
              <img [src]="'assets/img/albums/' + a.id + '.jpg'" [alt]="a.title" (error)="hide($event)" loading="lazy" />
            </div>
            <small>{{ a.year }} · {{ a.artist }}</small>
            <h3>{{ a.title }}</h3>
            <div class="album__songs">
              @for (s of a.songs; track s) {
                <a [href]="yt(a, s)" target="_blank" rel="noopener">♪ {{ s }}</a>
              }
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styleUrl: './music.component.scss',
})
export class MusicComponent {
  filters: { key: Filter; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'grupo', label: 'BTS' },
    { key: 'solo', label: 'Solistas' },
  ];

  filter = signal<Filter>('todos');
  list = computed(() =>
    ALBUMS.filter((a) => this.filter() === 'todos' || a.type === this.filter())
  );

  yt(a: Album, song: string) {
    return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`${a.artist} ${song}`);
  }

  hide(e: Event) {
    (e.target as HTMLImageElement).style.display = 'none';
  }
}