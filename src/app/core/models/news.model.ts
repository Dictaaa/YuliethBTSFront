export type NewsCategory = 'news' | 'release' | 'concert' | 'video';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: NewsCategory;
  relatedMembers: string[];
  publishedAt: string;       // AAAA-MM-DD
  eventDate: string | null;  // AAAA-MM-DD, solo en candidatos a evento
  status: 'official' | 'reported' | 'unconfirmed';
  source: string;
  sourceUrl: string;
  lastVerified: string;
}