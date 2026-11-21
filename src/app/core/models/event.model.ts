export type EventType = 'concierto' | 'lanzamiento' | 'especial';

export interface EventItem {
  id: string;
  title: string;
  date: string; // ISO local, ej: 2026-12-31T20:00:00
  type: EventType;
  place?: string;
  link?: string;
  note?: string;
  icon?: string;
}