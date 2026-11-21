export interface Album {
  id: string;
  title: string;
  year: number;
  type: 'grupo' | 'solo';
  artist: string;
  songs: string[];
}

export const ALBUMS: Album[] = [
  { id: '2cool4skool', title: '2 Cool 4 Skool', year: 2013, type: 'grupo', artist: 'BTS', songs: ['No More Dream'] },
  { id: 'skool-luv-affair', title: 'Skool Luv Affair', year: 2014, type: 'grupo', artist: 'BTS', songs: ['Boy In Luv'] },
  { id: 'dark-and-wild', title: 'Dark & Wild', year: 2014, type: 'grupo', artist: 'BTS', songs: ['Danger'] },
  { id: 'hyyh-pt1', title: 'The Most Beautiful Moment in Life Pt.1', year: 2015, type: 'grupo', artist: 'BTS', songs: ['I Need U'] },
  { id: 'hyyh-pt2', title: 'The Most Beautiful Moment in Life Pt.2', year: 2015, type: 'grupo', artist: 'BTS', songs: ['Run'] },
  { id: 'wings', title: 'Wings', year: 2016, type: 'grupo', artist: 'BTS', songs: ['Blood Sweat & Tears', 'Lost'] },
  { id: 'ynwa', title: 'You Never Walk Alone', year: 2017, type: 'grupo', artist: 'BTS', songs: ['Spring Day', 'Not Today'] },
  { id: 'ly-her', title: 'Love Yourself: Her', year: 2017, type: 'grupo', artist: 'BTS', songs: ['DNA', 'MIC Drop'] },
  { id: 'ly-tear', title: 'Love Yourself: Tear', year: 2018, type: 'grupo', artist: 'BTS', songs: ['Fake Love'] },
  { id: 'ly-answer', title: 'Love Yourself: Answer', year: 2018, type: 'grupo', artist: 'BTS', songs: ['Idol'] },
  { id: 'mots-persona', title: 'Map of the Soul: Persona', year: 2019, type: 'grupo', artist: 'BTS', songs: ['Boy With Luv'] },
  { id: 'mots-7', title: 'Map of the Soul: 7', year: 2020, type: 'grupo', artist: 'BTS', songs: ['ON', 'Black Swan'] },
  { id: 'be', title: 'BE', year: 2020, type: 'grupo', artist: 'BTS', songs: ['Dynamite', 'Life Goes On'] },
  { id: 'butter', title: 'Butter', year: 2021, type: 'grupo', artist: 'BTS', songs: ['Butter', 'Permission to Dance'] },
  { id: 'proof', title: 'Proof', year: 2022, type: 'grupo', artist: 'BTS', songs: ['Yet To Come'] },

  { id: 'indigo', title: 'Indigo', year: 2022, type: 'solo', artist: 'RM', songs: ['Wild Flower'] },
  { id: 'jack-in-the-box', title: 'Jack in the Box', year: 2022, type: 'solo', artist: 'j-hope', songs: ['MORE'] },
  { id: 'astronaut', title: 'The Astronaut', year: 2022, type: 'solo', artist: 'Jin', songs: ['The Astronaut'] },
  { id: 'face', title: 'FACE', year: 2023, type: 'solo', artist: 'Jimin', songs: ['Like Crazy'] },
  { id: 'd-day', title: 'D-DAY', year: 2023, type: 'solo', artist: 'Agust D', songs: ['Haegeum'] },
  { id: 'layover', title: 'Layover', year: 2023, type: 'solo', artist: 'V', songs: ['Slow Dancing'] },
  { id: 'golden', title: 'GOLDEN', year: 2023, type: 'solo', artist: 'Jung Kook', songs: ['Seven', '3D'] },
];