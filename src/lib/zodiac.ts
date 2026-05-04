/** Тропични зодии (български), ред от 0° Овен. */
export const ZODIAC_BG = [
  "Овен",
  "Телец",
  "Близнаци",
  "Рак",
  "Лъв",
  "Дева",
  "Везни",
  "Скорпион",
  "Стрелец",
  "Козирог",
  "Водолей",
  "Риби",
] as const;

export type ZodiacBg = (typeof ZODIAC_BG)[number];

export function zodiacFromLongitude(longitudeDeg: number): ZodiacBg {
  const i = Math.floor(((longitudeDeg % 360) + 360) % 360 / 30) % 12;
  return ZODIAC_BG[i];
}
