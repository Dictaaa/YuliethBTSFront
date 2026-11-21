import { Component, HostListener, signal } from '@angular/core';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { FOR_YULIETH } from '../../core/data/for-yulieth.data';

@Component({
  selector: 'app-for-yulieth',
  standalone: true,
  imports: [RevealDirective, SectionTitleComponent],
  templateUrl: './for-yulieth.component.html',
  styleUrl: './for-yulieth.component.scss',
})
export class ForYuliethComponent {
  d = FOR_YULIETH;

  flipped = signal<number[]>([]);
  current = signal<number | null>(null);

  hearts = Array.from({ length: 12 }, (_, i) => ({
    left: 4 + i * 8,
    delay: (i % 6) * 1.1,
    size: 14 + (i % 4) * 8,
  }));

  together = (() => {
    const diff = Date.now() - new Date(this.d.startDate).getTime();
    const days = Math.max(0, Math.floor(diff / 86_400_000));
    return {
      days,
      months: Math.floor(days / 30.44),
      hours: days * 24,
    };
  })();

  toggleFlip(i: number) {
    this.flipped.update((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]));
  }

  isFlipped(i: number) {
    return this.flipped().includes(i);
  }

  open(i: number) {
    this.current.set(i);
  }

  close() {
    this.current.set(null);
  }

  next() {
    const c = this.current();
    if (c !== null) this.current.set((c + 1) % this.d.gallery.length);
  }

  prev() {
    const c = this.current();
    if (c !== null) this.current.set((c - 1 + this.d.gallery.length) % this.d.gallery.length);
  }

  hideBroken(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (this.current() === null) return;
    if (e.key === 'Escape') this.close();
    if (e.key === 'ArrowRight') this.next();
    if (e.key === 'ArrowLeft') this.prev();
  }
}