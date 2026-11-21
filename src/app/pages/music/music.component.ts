import { Component, HostListener, OnDestroy, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { MusicService } from '../../core/services/music.service';
import { Album } from '../../core/data/music.data';

type Filter = 'todos' | 'grupo' | 'solo';

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './music.component.html',
  styleUrl: './music.component.scss',
})
export class MusicComponent implements OnDestroy {
  private svc = inject(MusicService);
  private audio = new Audio();

  all = toSignal(this.svc.albums$, { initialValue: [] as Album[] });
  filter = signal<Filter>('todos');
  selected = signal<Album | null>(null);
  playing = signal<string | null>(null);

  filters: { key: Filter; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'grupo', label: 'BTS' },
    { key: 'solo', label: 'Solistas' },
  ];

  list = computed(() => this.all().filter((a) => this.filter() === 'todos' || a.type === this.filter()));

  constructor() {
    this.audio.addEventListener('ended', () => this.playing.set(null));
  }

  open(a: Album) { this.selected.set(a); }

  close() {
    this.stop();
    this.selected.set(null);
  }

  toggle(url: string) {
    if (this.playing() === url) return this.stop();
    this.audio.src = url;
    this.audio.play().then(() => this.playing.set(url)).catch(() => this.playing.set(null));
  }

  stop() {
    this.audio.pause();
    this.playing.set(null);
  }

  search(base: string, a: Album, song?: string) {
    return base + encodeURIComponent(`${a.artist} ${song ?? a.title}`);
  }

  yt = (a: Album, s?: string) => this.search('https://www.youtube.com/results?search_query=', a, s);
  sp = (a: Album, s?: string) => this.search('https://open.spotify.com/search/', a, s);

  hide(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.selected()) this.close(); }

  ngOnDestroy() { this.audio.pause(); }
}