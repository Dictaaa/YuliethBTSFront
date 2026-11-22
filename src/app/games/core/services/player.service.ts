import { Injectable, computed, signal } from '@angular/core';
import { load, remove, save } from '../utils/storage';
import { HELLO, TRY, WIN, fill, pick } from '../utils/messages';

const KEY = 'army.name';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  name = signal<string>(load<string>(KEY, ''));
  hasName = computed(() => !!this.name());

  /** Limpia el texto (sin HTML ni símbolos raros) y lo guarda. Devuelve false si queda vacío */
  set(raw: string): boolean {
    const clean = raw
      .replace(/[^\p{L}\p{N} ._-]/gu, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 20);
    if (!clean) return false;
    const name = clean.charAt(0).toUpperCase() + clean.slice(1);
    this.name.set(name);
    save(KEY, name);
    return true;
  }

  clear() {
    this.name.set('');
    remove(KEY);
  }

  /** Frase con el nombre: ¡Excelente, Maria! */
  say(kind: 'win' | 'try' | 'hello'): string {
    const list = kind === 'win' ? WIN : kind === 'try' ? TRY : HELLO;
    return fill(pick(list), this.name());
  }
}