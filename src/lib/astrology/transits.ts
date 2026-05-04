import { calculatePosition, dateToJulianDay, Planet } from "@swisseph/node";

import { zodiacFromLongitude } from "@/lib/zodiac";

const BODIES: { planet: Planet; labelBg: string }[] = [
  { planet: Planet.Sun, labelBg: "Слънце" },
  { planet: Planet.Moon, labelBg: "Луна" },
  { planet: Planet.Mercury, labelBg: "Меркурий" },
  { planet: Planet.Venus, labelBg: "Венера" },
  { planet: Planet.Mars, labelBg: "Марс" },
  { planet: Planet.Jupiter, labelBg: "Юпитер" },
  { planet: Planet.Saturn, labelBg: "Сатурн" },
];

/**
 * Резюме на текущите тропични позиции за подаване към AI (сървър само).
 */
export function getTransitSummaryForPrompt(when: Date = new Date()): string {
  try {
    const jd = dateToJulianDay(when);
    const lines: string[] = [];
    for (const { planet, labelBg } of BODIES) {
      const pos = calculatePosition(jd, planet);
      const sign = zodiacFromLongitude(pos.longitude);
      lines.push(
        `${labelBg}: ${pos.longitude.toFixed(2)}° (${sign}, тропик)`,
      );
    }
    return lines.join("\n");
  } catch {
    return "Ефемеридите не са налични в момента; дай обща интерпретация без измислени градуси.";
  }
}

export function getMoonSignBg(when: Date = new Date()): string {
  try {
    const jd = dateToJulianDay(when);
    const pos = calculatePosition(jd, Planet.Moon);
    return zodiacFromLongitude(pos.longitude);
  } catch {
    return "неизвестно";
  }
}
