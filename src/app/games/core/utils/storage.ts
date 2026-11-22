export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* modo privado o sin espacio: el juego sigue funcionando sin guardar */
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {}
}

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Fecha local AAAA-MM-DD (sin desfase de zona horaria) */
export const today = () => ymd(new Date());

export const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return ymd(d);
};