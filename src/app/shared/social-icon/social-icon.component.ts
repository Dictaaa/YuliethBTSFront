import { Component, Input } from '@angular/core';

export type Net = 'instagram' | 'tiktok' | 'x' | 'youtube' | 'weverse';

@Component({
  selector: 'app-social-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      @switch (net) {
        @case ('instagram') {
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        }
        @case ('youtube') {
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10 9.5v5l4.5-2.5z" />
        }
        @case ('x') {
          <path d="M4 4l16 16M20 4L4 20" />
        }
        @case ('tiktok') {
          <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
          <path d="M14 3c.4 2.6 2.1 4.2 5 4.5" />
        }
        @case ('weverse') {
          <path d="M3 6l4.5 12L12 9l4.5 9L21 6" />
        }
      }
    </svg>
  `,
  styles: [':host { display: inline-flex; }'],
})
export class SocialIconComponent {
  @Input({ required: true }) net!: Net;
}