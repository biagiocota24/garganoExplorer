import type { AttractionCategory, Town } from "../api/attraction";

export const townTranslations: Record<Town, string> = {
  VIESTE: "Vieste",
  PESCHICI: "Peschici",
  RODI_GARGANICO: "Rodi Garganico",
  VICO_DEL_GARGANO: "Vico del Gargano",
  ISCHITELLA: "Ischitella",
  CARPINO: "Carpino",
  CAGNANO_VARANO: "Cagnano Varano",
  SAN_NICANDRO_GARGANICO: "San Nicandro Garganico",
  LESINA: "Lesina",
  MATTINATA: "Mattinata",
  MONTE_SANT_ANGELO: "Monte Sant'Angelo",
  MANFREDONIA: "Manfredonia",
  SAN_GIOVANNI_ROTONDO: "San Giovanni Rotondo",
  SAN_MARCO_IN_LAMIS: "San Marco in Lamis",
  RIGNANO_GARGANICO: "Rignano Garganico",
  ISOLE_TREMITI: "Isole Tremiti",
};

export const attractionCategoryTranslations: Record<
  AttractionCategory,
  string
> = {
  BEACH: "Spiaggia",
  CHURCH: "Chiesa",
  TRAIL: "Sentiero",
  HISTORIC_CENTER: "Centro storico",
  VIEWPOINT: "Punto panoramico",
  NATURE_RESERVE: "Riserva naturale",
  MUSEUM: "Museo",
  CAVE: "Grotta",
};
