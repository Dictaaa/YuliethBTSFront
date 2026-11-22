export type StatKey = 'energy' | 'budget' | 'mood' | 'prep';
export type Fx = Partial<Record<StatKey, number>>;

export const STAT_LABELS: Record<StatKey, string> = {
  energy: '⚡ Energía',
  budget: '💰 Presupuesto',
  mood: '😊 Ánimo',
  prep: '🎒 Preparación',
};

export interface Opt {
  id: string;
  icon: string;
  text: string;
  fx: Fx;
  tip: string; // puede llevar {nombre}
}

export interface Step {
  id: string;
  title: string;
  ask: string;
  multi?: number; // si existe: se eligen hasta N opciones
  options: Opt[];
}

export interface DayEvent {
  id: string;
  icon: string;
  title: string;
  need: string[]; // basta con haber llevado uno
  ok: string;
  fail: string;
  failFx: Fx;
}

export const STEPS: Step[] = [
  {
    id: 'outfit',
    title: 'El outfit',
    ask: '¿Qué te pones para el gran día?',
    options: [
      { id: 'comodo', icon: '👟', text: 'Ropa fresca y tenis cómodos', fx: { energy: 2, mood: 1 }, tip: 'Muy buena decisión, {nombre}: vas a aguantar horas de pie.' },
      { id: 'morado', icon: '💜', text: 'Todo morado, con accesorios ARMY', fx: { mood: 3, budget: -1 }, tip: '¡Borahae style, {nombre}! Te vas a ver increíble.' },
      { id: 'tacones', icon: '👠', text: 'Ropa nueva y zapatos que aún no estreno', fx: { mood: 2, energy: -2 }, tip: 'Se ve bien, pero los pies te lo van a cobrar, {nombre}.' },
      { id: 'cualquiera', icon: '🤷', text: 'Lo primero que encuentre', fx: { prep: -1 }, tip: 'Sin mucho plan, {nombre}. Salió, pero pudo ser mejor.' },
    ],
  },
  {
    id: 'lightstick',
    title: 'El lightstick',
    ask: '¿Cómo llegas con tu luz?',
    options: [
      { id: 'oficial', icon: '🪄', text: 'Llevo mi ARMY Bomb oficial', fx: { budget: -2, prep: 2, mood: 1 }, tip: 'El oficial es el que se sincroniza con el show, {nombre}.' },
      { id: 'decorado', icon: '✨', text: 'Decoro uno con mi propio toque', fx: { budget: -1, mood: 2, prep: 1 }, tip: 'Con tu estilo, {nombre}. ¡Ese sí va a destacar!' },
      { id: 'sin', icon: '😶', text: 'No llevo lightstick', fx: { mood: -2 }, tip: 'Cuando todos encienden su luz, {nombre}, se nota la falta.' },
    ],
  },
  {
    id: 'bag',
    title: 'La mochila',
    ask: 'Solo caben 3 cosas. ¿Cuáles llevas?',
    multi: 3,
    options: [
      { id: 'entrada', icon: '🎫', text: 'Entrada y documento', fx: { prep: 1 }, tip: '' },
      { id: 'agua', icon: '💧', text: 'Botella de agua', fx: { prep: 1 }, tip: '' },
      { id: 'powerbank', icon: '🔋', text: 'Powerbank', fx: { prep: 1 }, tip: '' },
      { id: 'snacks', icon: '🥪', text: 'Snacks', fx: { prep: 1 }, tip: '' },
      { id: 'poncho', icon: '🌧️', text: 'Poncho', fx: { prep: 1 }, tip: '' },
      { id: 'gorra', icon: '🧢', text: 'Gorra para el sol', fx: { prep: 1 }, tip: '' },
    ],
  },
  {
    id: 'arrival',
    title: 'La llegada',
    ask: '¿Cómo llegas al estadio?',
    options: [
      { id: 'temprano', icon: '⏰', text: 'Llego temprano y con calma', fx: { prep: 2, energy: -1, mood: 1 }, tip: 'Buen puesto y sin correr, {nombre}.' },
      { id: 'grupo', icon: '👯', text: 'Voy con mi grupo de ARMYs', fx: { mood: 3, budget: -1 }, tip: 'Con amigas todo se disfruta el doble, {nombre}.' },
      { id: 'justo', icon: '🏃', text: 'Llego justo a tiempo', fx: { prep: -1, mood: -1, energy: 1 }, tip: 'Te tocó correr, {nombre}, pero llegaste.' },
      { id: 'tarde', icon: '😴', text: 'Duermo de más y salgo corriendo', fx: { energy: 1, prep: -2, mood: -1 }, tip: 'Uy, {nombre}. Casi no llegas.' },
    ],
  },
  {
    id: 'songs',
    title: 'La preparación musical',
    ask: '¿Qué hiciste con las canciones antes del show?',
    options: [
      { id: 'letras', icon: '📖', text: 'Repasé letras y fanchants', fx: { prep: 2, mood: 2 }, tip: '¡Vas a cantar todo, {nombre}!' },
      { id: 'playlist', icon: '🎧', text: 'Escuché la playlist en el camino', fx: { mood: 1 }, tip: 'Algo es algo, {nombre}.' },
      { id: 'nada', icon: '🙈', text: 'Nada, que sea sorpresa', fx: { mood: -1 }, tip: 'Algunas canciones se te van a escapar, {nombre}.' },
    ],
  },
  {
    id: 'merch',
    title: 'El merch',
    ask: 'Ves la tienda oficial del concierto. ¿Qué haces?',
    options: [
      { id: 'todo', icon: '🛍️', text: 'Compro de todo', fx: { mood: 2, budget: -3 }, tip: 'Mucha felicidad y la billetera vacía, {nombre}.' },
      { id: 'uno', icon: '🎁', text: 'Solo un recuerdito', fx: { mood: 1, budget: -1 }, tip: 'Equilibrio perfecto, {nombre}.' },
      { id: 'ahorro', icon: '🐷', text: 'Guardo mi dinero y disfruto el show', fx: { budget: 1, mood: 1 }, tip: 'Muy sensato, {nombre}.' },
      { id: 'amigas', icon: '💝', text: 'También compro para mis amigas', fx: { mood: 2, budget: -2 }, tip: 'Qué detalle, {nombre} 💜' },
    ],
  },
];

export const EVENTS: DayEvent[] = [
  { id: 'entrada', icon: '🎫', title: 'Entrada en la puerta', need: ['entrada'], ok: 'Mostraste tu entrada y entraste sin problema.', fail: 'No tenías tu entrada a la mano y perdiste tiempo en la fila.', failFx: { prep: -3, mood: -1 } },
  { id: 'calor', icon: '☀️', title: 'Mucho calor', need: ['agua', 'gorra'], ok: 'Te cuidaste del calor y aguantaste todo el show.', fail: 'Sin agua ni gorra, el calor te pasó factura.', failFx: { energy: -2 } },
  { id: 'bateria', icon: '🔋', title: 'Batería baja', need: ['powerbank'], ok: 'Tu powerbank salvó tus videos y recuerdos.', fail: 'Se te acabó la batería justo en tu canción favorita.', failFx: { mood: -2 } },
  { id: 'hambre', icon: '🥪', title: 'Hambre en la fila', need: ['snacks'], ok: 'Tus snacks te dieron energía para seguir.', fail: 'Pasaste hambre mientras esperabas.', failFx: { energy: -1 } },
  { id: 'lluvia', icon: '🌧️', title: 'Llovizna', need: ['poncho'], ok: 'Tu poncho te protegió de la lluvia.', fail: 'Te mojaste y se te bajó el ánimo.', failFx: { mood: -1 } },
];