import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MEMBERS, MEMBER_EXTRA } from '../../core/data/bts.data';
import { MEMBER_MEDIA } from '../../core/data/member-media.data';
import { TimelineComponent } from '../../shared/timeline/timeline.component';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { SocialIconComponent } from '../../shared/social-icon/social-icon.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [RouterLink, TimelineComponent, SectionTitleComponent, SocialIconComponent, RevealDirective],
  template: `
    @if (member(); as m) {
      <section class="container md">
        <a routerLink="/miembros" class="md__back">← Todos los integrantes</a>

        <div class="md__hero">
          <div class="md__photo" appReveal="left">
            @if (failed() !== m.id) {
              <img [src]="m.photo" [alt]="m.stage" (error)="failed.set(m.id)" referrerpolicy="no-referrer" />
            } @else {
              <span>{{ m.stage.charAt(0) }}</span>
            }
          </div>

          <div appReveal="right" [revealDelay]="150">
            <span class="md__role">{{ m.role }}</span>
            <h1>{{ m.stage }}</h1>
            <p class="md__real">{{ m.real }} · 🎂 {{ m.birthday }}</p>
            <p class="md__bio">{{ bio() }}</p>

            @if (socials().length) {
              <ul class="md__socials">
                @for (s of socials(); track s.url) {
                  <li>
                    <a [href]="s.url" target="_blank" rel="noopener noreferrer">
                      <app-social-icon [net]="s.net" />
                      <span>{{ s.user }}</span>
                    </a>
                  </li>
                }
              </ul>
            }
          </div>
        </div>

        <div class="md__block">
          <app-section-title appReveal="up" title="Galería" [subtitle]="'Fotos de ' + m.stage" />
          <div class="md__gallery">
            @for (g of gallery(); let i = $index; track i) {
              <button class="shot" (click)="open(i)" appReveal="zoom" [revealDelay]="i * 120"
                [disabled]="!g || badImg().has(g)">
                <span class="shot__ph">💜</span>
                @if (g && !badImg().has(g)) {
                  <img [src]="g" [alt]="m.stage + ' foto ' + (i + 1)" loading="lazy"
                    referrerpolicy="no-referrer" (error)="markBad(g)" />
                }
              </button>
            }
          </div>
          <p class="md__credit">Fotos con licencia libre de Wikimedia Commons. Crédito a sus autores.</p>
        </div>

        @if (solo().length) {
          <div class="md__block">
            <app-section-title appReveal="up" title="Su música en solitario" subtitle="Proyectos individuales" />
            <app-timeline [items]="solo()" />
          </div>
        }

        <nav class="md__nav">
          <a [routerLink]="['/miembros', prev().id]">← {{ prev().stage }}</a>
          <a [routerLink]="['/miembros', next().id]">{{ next().stage }} →</a>
        </nav>
      </section>

      @if (current() !== null && gallery()[current()!]) {
        <div class="lb" (click)="close()">
          <button class="lb__nav" (click)="$event.stopPropagation(); step(-1)" aria-label="Anterior">‹</button>
          <img [src]="gallery()[current()!]" [alt]="m.stage" referrerpolicy="no-referrer"
            (click)="$event.stopPropagation()" />
          <button class="lb__nav" (click)="$event.stopPropagation(); step(1)" aria-label="Siguiente">›</button>
          <button class="lb__x" (click)="close()" aria-label="Cerrar">✕</button>
        </div>
      }
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
  current = signal<number | null>(null);
  badImg = signal<Set<string>>(new Set());

  member = computed(() => MEMBERS.find((m) => m.id === this.id()));
  bio = computed(() => MEMBER_EXTRA[this.id()]?.bio ?? '');
  solo = computed(() => MEMBER_EXTRA[this.id()]?.solo ?? []);
  socials = computed(() => MEMBER_MEDIA[this.id()]?.socials ?? []);
  gallery = computed(() => {
    const g = MEMBER_MEDIA[this.id()]?.gallery ?? [];
    return Array.from({ length: 4 }, (_, i) => g[i] ?? '');
  });

  private idx = computed(() => MEMBERS.findIndex((m) => m.id === this.id()));
  prev = computed(() => MEMBERS[(this.idx() - 1 + MEMBERS.length) % MEMBERS.length]);
  next = computed(() => MEMBERS[(this.idx() + 1) % MEMBERS.length]);

  markBad(url: string) {
    this.badImg.update((s) => new Set(s).add(url));
  }

  open(i: number) { this.current.set(i); }
  close() { this.current.set(null); }

  step(d: number) {
    const valid = this.gallery().map((g, i) => (g && !this.badImg().has(g) ? i : -1)).filter((i) => i >= 0);
    const c = this.current();
    if (c === null || !valid.length) return;
    const pos = valid.indexOf(c);
    this.current.set(valid[(pos + d + valid.length) % valid.length]);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (this.current() === null) return;
    if (e.key === 'Escape') this.close();
    if (e.key === 'ArrowRight') this.step(1);
    if (e.key === 'ArrowLeft') this.step(-1);
  }
}