/**
 * Астрология: ефемериди (@swisseph/node) за сървърни API маршрути.
 * Клиентът не трябва да импортира `./transits` — само Node runtime.
 */

export type BirthInput = {
  dateUtc: string;
  latitude: number;
  longitude: number;
};

export type PlanetPosition = {
  id: string;
  longitudeDeg: number;
};

/** Placeholder за бъдеща натална карта + sweph интеграция. */
export async function computeNatalSnapshot(
  input: BirthInput,
): Promise<PlanetPosition[]> {
  void input;
  return [];
}

export { getMoonSignBg, getTransitSummaryForPrompt } from "./transits";
