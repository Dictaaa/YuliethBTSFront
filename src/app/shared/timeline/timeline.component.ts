import { AfterViewInit, Component, ElementRef, HostListener, Input, inject, signal } from '@angular/core';
import { RevealDirective } from '../directives/reveal.directive';
import { TimelineItem } from '../../core/models/timeline-item.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <div class="tl">
      <div class="tl__line"><span class="tl__fill" [style.height.%]="fill()"></span></div>

      @for (it of items; track it.year + it.title; let i = $index) {
        <article class="tl__item" [class.tl__item--right]="i % 2 === 1" [appReveal]="i % 2 === 0 ? 'left' : 'right'">
          <span class="tl__dot">{{ it.icon || '💜' }}</span>
          <div class="tl__card">
            <small>{{ it.year }}</small>
            <h3>{{ it.title }}</h3>
            <p>{{ it.text }}</p>
          </div>
        </article>
      }
    </div>
  `,
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements AfterViewInit {
  @Input({ required: true }) items: TimelineItem[] = [];

  fill = signal(0);
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterViewInit() {
    setTimeout(() => this.update());
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  update() {
    const r = this.el.nativeElement.getBoundingClientRect();
    if (!r.height) return;
    const p = (window.innerHeight * 0.65 - r.top) / r.height;
    this.fill.set(Math.min(1, Math.max(0, p)) * 100);
  }
}