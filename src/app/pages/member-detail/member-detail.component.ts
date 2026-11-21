import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MEMBERS, MEMBER_EXTRA } from '../../core/data/bts.data';
import { TimelineComponent } from '../../shared/timeline/timeline.component';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [RouterLink, TimelineComponent, SectionTitleComponent, RevealDirective],
  template: `
    @if (member(); as m) {
      <section class="container md">
        <a routerLink="/miembros" class="md__back">← Todos los integrantes</a>

        <div class="md__hero">
          <div class="md__photo" appReveal="left">
            @if (failed() !== m.id) {
              <img [src]="m.photo" [alt]="m.stage" (error)="failed.set(m.id)" />
            } @else {
              <span>{{ m.stage.charAt(0) }}</span>
            }
          </div>

          <div appReveal="right" [revealDelay]="150">
            <span class="md__role">{{ m.role }}</span>
            <h1>{{ m.stage }}</h1>
            <p class="md__real">{{ m.real }} · 🎂 {{ m.birthday }}</p>
            <p class="md__bio">{{ bio() }}</p>
          </div>
        </div>

        @if (solo().length) {
          <div class="md__solo">
            <app-section-title appReveal="up" title="Su música en solitario" subtitle="Proyectos individuales" />
            <app-timeline [items]="solo()" />
          </div>
        }

        <nav class="md__nav">
          <a [routerLink]="['/miembros', prev().id]">← {{ prev().stage }}</a>
          <a [routerLink]="['/miembros', next().id]">{{ next().stage }} →</a>
        </nav>
      </section>
    } @else {
      <section class="container md">
        <header class="page-head">
          <h1>No encontré a ese integrante 😢</h1>
          <p><a routerLink="/miembros">Volver a los integrantes</a></p>
        </header>
      </section>
    }
  `,
  styleUrl: './member-detail.component.scss',
})
export class MemberDetailComponent {
  private route = inject(ActivatedRoute);

  id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), { initialValue: '' });
  failed = signal<string | null>(null);

  member = computed(() => MEMBERS.find((m) => m.id === this.id()));
  bio = computed(() => MEMBER_EXTRA[this.id()]?.bio ?? '');
  solo = computed(() => MEMBER_EXTRA[this.id()]?.solo ?? []);

  private idx = computed(() => MEMBERS.findIndex((m) => m.id === this.id()));
  prev = computed(() => MEMBERS[(this.idx() - 1 + MEMBERS.length) % MEMBERS.length]);
  next = computed(() => MEMBERS[(this.idx() + 1) % MEMBERS.length]);
}