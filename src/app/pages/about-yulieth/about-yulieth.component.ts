import { Component, signal } from '@angular/core';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { YULIETH } from '../../core/data/yulieth.data';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about-yulieth',
  standalone: true,
  imports: [SectionTitleComponent, RevealDirective],
  templateUrl: './about-yulieth.component.html',
  styleUrl: './about-yulieth.component.scss',
})
export class AboutYuliethComponent {
  y = YULIETH;
  photoOk = signal(true);
  yearsArmy = new Date().getFullYear() - YULIETH.armySince;

  facts = [
    { label: 'ARMY desde', value: String(YULIETH.armySince) },
    { label: 'Mi bias', value: YULIETH.bias },
    { label: 'Canción favorita', value: YULIETH.favoriteSong },
    { label: 'Álbum favorito', value: YULIETH.favoriteAlbum },
  ];

  get socialList() {
    const s = this.y.socials;
    return [
      { name: 'Instagram', url: s.instagram },
      { name: 'TikTok', url: s.tiktok },
      { name: 'Weverse', url: s.weverse },
    ].filter((x) => x.url);
  }
}