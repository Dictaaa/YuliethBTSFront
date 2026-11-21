export interface Member {
  id: string;
  stage: string;
  real: string;
  role: string;
  birthday: string;
  photo: string;
}

export const BTS_INTRO =
  'BTS (방탄소년단) es un grupo surcoreano de K-pop formado por RM, Jin, Suga, J-Hope, Jimin, V y Jung Kook. Debutaron en 2013 y se volvieron un fenómeno mundial por su música, sus coreografías y sus mensajes de amor propio. Su fandom se llama ARMY.';

export const GROUP_FACTS = [
  { icon: '🎤', value: '2013', label: 'Año de debut (13 de junio)' },
  { icon: '💜', value: '7', label: 'Integrantes' },
  { icon: '🏢', value: 'HYBE', label: 'Su compañía (Big Hit Music)' },
  { icon: '✨', value: 'ARMY', label: 'Su fandom oficial' },
];

export const MEMBERS: Member[] = [
  { id: 'rm', stage: 'RM', real: 'Kim Namjoon', role: 'Líder · Rapero', birthday: '12 sep 1994', photo: 'https://assets.teenvogue.com/photos/5db855b883e32700089e9db9/16:9/w_2560%2Cc_limit/GettyImages-1140670826.jpg' },
  { id: 'jin', stage: 'Jin', real: 'Kim Seokjin', role: 'Vocalista', birthday: '4 dic 1992', photo: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcTD5PJ16OO9X8R22qfhIP25u9u0UbLIw7q4ejWpeHTDI56AtHqDlsiVLNXZN8ySHXyRp1QDwaebZSeVbh4' },
  { id: 'suga', stage: 'Suga', real: 'Min Yoongi', role: 'Rapero · Productor', birthday: '9 mar 1993', photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Suga_for_Valentino_and_Marie_Claire_Korea_06.jpg/960px-Suga_for_Valentino_and_Marie_Claire_Korea_06.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=thumbnail' },
  { id: 'jhope', stage: 'J-Hope', real: 'Jung Hoseok', role: 'Rapero · Bailarín', birthday: '18 feb 1994', photo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/J-Hope_at_the_2022_Fact_Music_Awards_on_October_8%2C_2022_%28cropped%29.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original' },
  { id: 'jimin', stage: 'Jimin', real: 'Park Jimin', role: 'Vocalista · Bailarín', birthday: '13 oct 1995', photo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Jimin_on_the_way_to_SBS_Radio%2C_31_March_2023_%282%29.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original' },
  { id: 'v', stage: 'V', real: 'Kim Taehyung', role: 'Vocalista', birthday: '30 dic 1995', photo: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/BTS%27s_V_20251004_04.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original' },
  { id: 'jungkook', stage: 'Jung Kook', real: 'Jeon Jungkook', role: 'Vocalista principal · Maknae', birthday: '1 sep 1997', photo: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Jung_Kook_of_BTS%2C_February_12%2C_2026_%281%29.png?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original' },
];

export const MARQUEE_ITEMS = ['BTS', '♪', 'ARMY', '💜', '보라해', '♫', 'Borahae', '💜', '방탄소년단', '♬'];

import { TimelineItem } from '../models/timeline-item.model';

export const MEMBER_EXTRA: Record<string, { bio: string; solo: TimelineItem[] }> = {
  rm: {
    bio: 'Líder de BTS y su principal voz en inglés. Escribe letras, compone y fue quien habló en la ONU en 2018 en nombre del grupo.',
    solo: [
      { year: '2022', icon: '🎨', title: 'Indigo', text: 'Su primer álbum de estudio en solitario (diciembre).' },
      { year: '2024', icon: '🎶', title: 'Right Place, Wrong Person', text: 'Su segundo álbum solista (mayo).' },
    ],
  },
  jin: {
    bio: 'El mayor del grupo. Voz dulce, humor inigualable y fama de carismático. Fue el primero en terminar el servicio militar en 2024.',
    solo: [
      { year: '2022', icon: '🚀', title: 'The Astronaut', text: 'Sencillo en solitario escrito junto a Coldplay (octubre).' },
      { year: '2024', icon: '😄', title: 'Happy', text: 'Su primer álbum solista (noviembre).' },
    ],
  },
  suga: {
    bio: 'Rapero, compositor y productor. Como solista usa el nombre Agust D y es conocido por sus letras sinceras.',
    solo: [
      { year: '2016', icon: '🎤', title: 'Agust D', text: 'Su primer mixtape como solista.' },
      { year: '2020', icon: '🎹', title: 'D-2', text: 'Su segundo mixtape.' },
      { year: '2023', icon: '🌅', title: 'D-DAY', text: 'Su primer álbum de estudio como Agust D (abril).' },
    ],
  },
  jhope: {
    bio: 'La esperanza de BTS: bailarín, rapero y la energía del grupo. En 2022 fue el primer coreano en encabezar el festival Lollapalooza.',
    solo: [
      { year: '2018', icon: '🌍', title: 'Hope World', text: 'Su primer mixtape.' },
      { year: '2022', icon: '📦', title: 'Jack in the Box', text: 'Su primer álbum solista (julio).' },
      { year: '2024', icon: '🛣️', title: 'Hope on the Street Vol.1', text: 'Proyecto sobre su amor por el baile (marzo).' },
    ],
  },
  jimin: {
    bio: 'Vocalista y bailarín de movimientos delicados y muy expresivos. Su sencillo "Like Crazy" llegó al #1 del Billboard Hot 100.',
    solo: [
      { year: '2023', icon: '🎭', title: 'FACE', text: 'Su primer álbum solista, con "Like Crazy" (marzo).' },
      { year: '2024', icon: '🌙', title: 'MUSE', text: 'Su segundo álbum solista (julio).' },
    ],
  },
  v: {
    bio: 'Vocalista de voz grave y estilo único, también ha actuado en dramas coreanos. Su música tiene un aire jazz y retro.',
    solo: [
      { year: '2023', icon: '✈️', title: 'Layover', text: 'Su primer álbum solista, con "Slow Dancing" (septiembre).' },
    ],
  },
  jungkook: {
    bio: 'El menor del grupo (maknae) y vocalista principal. Cantó en la inauguración del Mundial de Qatar 2022 y su sencillo "Seven" llegó al #1 del Hot 100.',
    solo: [
      { year: '2023', icon: '💛', title: 'Seven (feat. Latto)', text: 'Su primer sencillo solista (julio).' },
      { year: '2023', icon: '🌟', title: 'GOLDEN', text: 'Su primer álbum solista (noviembre).' },
    ],
  },
};