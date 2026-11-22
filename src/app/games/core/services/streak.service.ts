import { Injectable, computed, signal } from '@angular/core';
import { load, remove, save, today, yesterday } from '../../core/utils/storage';

const KEY = 'army.streak';

@Injectable({ providedIn: 'root' })
export class StreakService {
  state = signal<{ count: number; last: string }>(load(KEY, { count: 0, last: '' }));

  /** Si ayer no jugó ni hoy, la racha se muestra en 0 */
  current = computed(() => {
    const s = this.state();
    return s.last === today() || s.last === yesterday() ? s.count : 0;
  });

  playedToday = computed(() => this.state().last === today());

  /** Se llama al terminar cualquier partida: cuenta un día por cada fecha distinta */
  register() {
    const s = this.state();
    const t = today();
    if (s.last === t) return;
    const next = { count: s.last === yesterday() ? s.count + 1 : 1, last: t };
    this.state.set(next);
    save(KEY, next);
  }

  reset() {
    this.state.set({ count: 0, last: '' });
    remove(KEY);
  }
}