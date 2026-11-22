export interface EmojiSong {
  level: 1 | 2 | 3;
  emojis: string[];
  title: string;
  aliases?: string[]; // otras formas válidas de escribirlo (nivel 3)
}

const s = (level: 1 | 2 | 3, emojis: string[], title: string, aliases: string[] = []): EmojiSong => ({
  level,
  emojis,
  title,
  aliases,
});

export const EMOJI_SONGS: EmojiSong[] = [
  // ---------- Nivel 1: un emoji ----------
  s(1, ['🧈'], 'Butter'),
  s(1, ['🧨'], 'Dynamite'),
  s(1, ['🔥'], 'Fire'),
  s(1, ['🏃'], 'Run'),
  s(1, ['🧬'], 'DNA'),
  s(1, ['🌙'], 'Moon'),
  s(1, ['💭'], 'Dreamers'),
  s(1, ['7️⃣'], 'Seven'),
  s(1, ['🦸'], 'Anpanman'),
  s(1, ['🚫'], 'Not Today'),
  s(1, ['⚠️'], 'Danger'),
  s(1, ['🐻'], 'Winter Bear'),

  // ---------- Nivel 2: dos emojis ----------
  s(2, ['👦', '💘'], 'Boy With Luv'),
  s(2, ['🤪', '🚗'], 'Like Crazy'),
  s(2, ['🎤', '⬇️'], 'MIC Drop'),
  s(2, ['🌱', '➡️'], 'Life Goes On'),
  s(2, ['💃', '🕺'], 'Permission to Dance'),
  s(2, ['🌟', '👑'], 'Idol'),
  s(2, ['🎭', '💔'], 'Fake Love'),
  s(2, ['❄️', '🌸'], 'Spring Day'),
  s(2, ['🦢', '🖤'], 'Black Swan'),
  s(2, ['🩸', '💦'], 'Blood Sweat & Tears'),
  s(2, ['🪄', '🏪'], 'Magic Shop'),
  s(2, ['🌌', '✨'], 'Mikrokosmos'),

  // ---------- Nivel 3: tres emojis, se escribe ----------
  s(3, ['🙏', '💔', '😭'], 'I Need U', ['I Need You']),
  s(3, ['💡', '🌈', '😇'], 'Epiphany'),
  s(3, ['🧠', '📡', '💬'], 'Telepathy'),
  s(3, ['😎', '🔥', '🙌'], 'Dope'),
  s(3, ['🌈', '😍', '✨'], 'Euphoria'),
  s(3, ['🎬', '📼', '🚪'], 'Film Out'),
  s(3, ['🕛', '🌃', '🌠'], "Zero O'Clock", ['Zero O Clock', '0 oclock']),
  s(3, ['🌼', '🌿', '🌬️'], 'Wild Flower', ['Wildflower']),
  s(3, ['🧍', '💑', '✨'], 'Standing Next to You'),
  s(3, ['🆘', '🙏', '💜'], 'Save ME', ['Save Me']),
  s(3, ['🔵', '⚪', '😔'], 'Blue & Grey', ['Blue and Grey', 'Blue Grey']),
  s(3, ['👦', '❤️', '🔥'], 'Boy In Luv', ['Boy in Love']),
];

export const ALL_TITLES = EMOJI_SONGS.map((x) => x.title);