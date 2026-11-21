import { Component } from '@angular/core';
import { TimelineComponent } from '../../shared/timeline/timeline.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { GROUP_TIMELINE } from '../../core/data/timeline.data';

@Component({
  selector: 'app-chronology',
  standalone: true,
  imports: [TimelineComponent, RevealDirective],
  template: `
    <section class="container">
      <header class="page-head">
        <h1 appReveal="up">Cronología de BTS ♪</h1>
        <p appReveal="up" [revealDelay]="150">
          De un debut en 2013 a ser uno de los grupos más grandes del mundo. Sigue la línea mientras bajas. 💜
        </p>
      </header>
      <app-timeline [items]="items" />
    </section>
  `,
  styleUrl: './chronology.component.scss',
})
export class ChronologyComponent {
  items = GROUP_TIMELINE;
}