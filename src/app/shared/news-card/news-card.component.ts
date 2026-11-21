import { Component, Input, computed, signal } from '@angular/core';
import { NewsItem } from '../../core/models/news.model';
import { fmtShort } from '../../core/utils/date.utils';

const LABELS: Record<string, string> = {
  news: '📰 Noticia',
  release: '💿 Lanzamiento',
  concert: '🎤 Concierto / gira',
  video: '▶️ Video',
};

@Component({
  selector: 'app-news-card',
  standalone: true,
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.scss',
})
export class NewsCardComponent {
  private _n = signal<NewsItem | null>(null);

  @Input({ required: true }) set item(v: NewsItem) {
    this._n.set(v);
    this.imgOk.set(true);
  }
  get item(): NewsItem {
    return this._n()!;
  }

  imgOk = signal(true);

  label = computed(() => LABELS[this._n()?.category ?? 'news']);
  official = computed(() => this._n()?.status === 'official');
  date = computed(() => fmtShort(this._n()!.publishedAt));

  thumb = computed(() => {
    const n = this._n();
    if (!n || n.category !== 'video') return '';
    try {
      const id = new URL(n.sourceUrl).searchParams.get('v');
      return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
    } catch {
      return '';
    }
  });
}