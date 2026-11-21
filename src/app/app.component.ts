import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="progress" [style.width.%]="progress()"></div>

    <div class="floaties" aria-hidden="true">
      @for (f of floaties; track $index) {
        <span
          [style.left.%]="f.left"
          [style.font-size.px]="f.size"
          [style.animation-delay.s]="f.delay"
          [style.animation-duration.s]="f.duration"
          [style.color]="f.color"
          >{{ f.symbol }}</span
        >
      }
    </div>

    <app-navbar />
    <main class="main">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [
    `
      .main {
        position: relative;
        z-index: 1;
        min-height: 70vh;
        padding-top: 72px;
      }
      .progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        z-index: 100;
        background: linear-gradient(90deg, #6c3acd, #b69aef, #f0c6e9);
        transition: width 0.1s linear;
      }
      .floaties {
        position: fixed;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        pointer-events: none;
      }
      .floaties span {
        position: absolute;
        bottom: -60px;
        opacity: 0;
        animation: rise linear infinite;
      }
      @keyframes rise {
        0% { transform: translateY(0) rotate(-10deg); opacity: 0; }
        12% { opacity: 0.5; }
        50% { transform: translateY(-55vh) rotate(12deg); }
        100% { transform: translateY(-115vh) rotate(-8deg); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        .floaties span { animation: none; }
      }
    `,
  ],
})
export class AppComponent {
  progress = signal(0);

  private symbols = ['💜', '♪', '♫', '💜', '♬', '🎵'];
  private colors = ['#b69aef', '#f0c6e9', '#6c3acd', '#fff7ff'];

  floaties = Array.from({ length: 16 }, (_, i) => ({
    symbol: this.symbols[i % this.symbols.length],
    color: this.colors[i % this.colors.length],
    left: 3 + ((i * 37) % 94),
    size: 16 + (i % 4) * 7,
    delay: (i * 1.7) % 14,
    duration: 14 + (i % 5) * 3,
  }));

  @HostListener('window:scroll')
  onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.progress.set(max > 0 ? (window.scrollY / max) * 100 : 0);
  }
}