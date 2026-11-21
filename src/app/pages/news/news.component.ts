import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NewsService } from '../../core/services/news.service';
import { NewsCategory } from '../../core/models/news.model';
import { NewsCardComponent } from '../../shared/news-card/news-card.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

type Cat = 'todas' | NewsCategory;

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NewsCardComponent, RevealDirective],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  private svc = inject(NewsService);

  all = toSignal(this.svc.news$, { initialValue: [] });
  cat = signal<Cat>('todas');
  member = signal('Todos');
  onlyOfficial = signal(false);
  shown = signal(12);

  cats: { key: Cat; label: string }[] = [
    { key: 'todas', label: 'Todo' },
    { key: 'concert', label: '🎤 Conciertos' },
    { key: 'release', label: '💿 Lanzamientos' },
    { key: 'video', label: '▶️ Videos' },
    { key: 'news', label: '📰 Noticias' },
  ];

  members = ['Todos', 'BTS', 'RM', 'Jin', 'Suga', 'J-Hope', 'Jimin', 'V', 'Jung Kook'];

  filtered = computed(() =>
    this.all().filter(
      (n) =>
        (this.cat() === 'todas' || n.category === this.cat()) &&
        (this.member() === 'Todos' || n.relatedMembers.includes(this.member())) &&
        (!this.onlyOfficial() || n.status === 'official')
    )
  );

  list = computed(() => this.filtered().slice(0, this.shown()));

  setCat(c: Cat) { this.cat.set(c); this.shown.set(12); }
  setMember(m: string) { this.member.set(m); this.shown.set(12); }
  setOfficial(v: boolean) { this.onlyOfficial.set(v); this.shown.set(12); }
  more() { this.shown.update((n) => n + 12); }
}