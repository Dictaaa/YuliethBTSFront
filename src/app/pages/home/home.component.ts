import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { MemberCardComponent } from '../../shared/member-card/member-card.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { QUICK_LINKS, YULIETH } from '../../core/data/yulieth.data';
import { BTS_INTRO, GROUP_FACTS, MARQUEE_ITEMS, MEMBERS } from '../../core/data/bts.data';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { EventsService } from '../../core/services/events.service';
import { daysLeft, fmtDate } from '../../core/utils/date.utils';
import { NewsService } from '../../core/services/news.service';
import { NewsCardComponent } from '../../shared/news-card/news-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SectionTitleComponent, MemberCardComponent, RevealDirective, NewsCardComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  yulieth = YULIETH;
  links = QUICK_LINKS;
  intro = BTS_INTRO;
  facts = GROUP_FACTS;
  members = MEMBERS;
  marquee = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  photoOk = signal(true);
  private eventsSvc = inject(EventsService);
nextEvents = toSignal(this.eventsSvc.upcoming$.pipe(map((l) => l.slice(0, 3))), { initialValue: [] });
fmt = fmtDate;
days = daysLeft;
private newsSvc = inject(NewsService);
latestNews = toSignal(this.newsSvc.news$.pipe(map((l) => l.slice(0, 6))), { initialValue: [] });
}