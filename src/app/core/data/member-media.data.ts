import { Net } from '../../shared/social-icon/social-icon.component';

export interface Social {
  net: Net;
  user: string; // lo que se muestra, ej. @jin
  url: string;
}

export interface MemberMedia {
  gallery: string[]; // 4 fotos (URL)
  socials: Social[];
}

// TODO: pega aquí las 4 URLs de cada uno. Si dejas '' se muestra un marcador bonito.
// TODO: verifica cada usuario abriendo su enlace. Si alguien no tiene una red, borra esa línea.
export const MEMBER_MEDIA: Record<string, MemberMedia> = {
  rm: {
    gallery: ['', '', '', ''],
    socials: [{ net: 'instagram', user: '@rkive', url: 'https://www.instagram.com/rkive/' }],
  },
  jin: {
    gallery: ['', '', '', ''],
    socials: [{ net: 'instagram', user: '@jin', url: 'https://www.instagram.com/jin/' }],
  },
  suga: {
    gallery: ['', '', '', ''],
    socials: [{ net: 'instagram', user: '@agustd', url: 'https://www.instagram.com/agustd/' }],
  },
  jhope: {
    gallery: ['', '', '', ''],
    socials: [{ net: 'instagram', user: '@uarmyhope', url: 'https://www.instagram.com/uarmyhope/' }],
  },
  jimin: {
    gallery: ['', '', '', ''],
    socials: [{ net: 'instagram', user: '@j.m', url: 'https://www.instagram.com/j.m/' }],
  },
  v: {
    gallery: ['', '', '', ''],
    socials: [{ net: 'instagram', user: '@thv', url: 'https://www.instagram.com/thv/' }],
  },
  jungkook: {
    gallery: ['', '', '', ''],
    socials: [{ net: 'instagram', user: '@jungkook.97', url: 'https://www.instagram.com/jungkook.97/' }],
  },
};