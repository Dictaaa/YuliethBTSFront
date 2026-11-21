import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-countdown',
  standalone: true,
  template: `
    @if (left().done) {
      <p class="cd__done">¡Ya llegó el día! 🎉💜</p>
    } @else {
      <div class="cd">
        <div><strong>{{ left().d }}</strong><span>días</span></div>
        <div><strong>{{ pad(left().h) }}</strong><span>horas</span></div>
        <div><strong>{{ pad(left().m) }}</strong><span>min</span></div>
        <div><strong>{{ pad(left().s) }}</strong><span>seg</span></div>
      </div>
    }
  `,
  styleUrl: './countdown.component.scss',
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input({ required: true }) target!: string;

  left = signal({ d: 0, h: 0, m: 0, s: 0, done: false });
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  pad(n: number) {
    return String(n).padStart(2, '0');
  }

  private tick() {
    const diff = new Date(this.target).getTime() - Date.now();
    if (diff <= 0) {
      this.left.set({ d: 0, h: 0, m: 0, s: 0, done: true });
      return;
    }
    const s = Math.floor(diff / 1000);
    this.left.set({
      d: Math.floor(s / 86400),
      h: Math.floor((s % 86400) / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60,
      done: false,
    });
  }
}