export type Page<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type Town =
  | "VIESTE"
  | "PESCHICI"
  | "RODI_GARGANICO"
  | "VICO_DEL_GARGANO"
  | "ISCHITELLA"
  | "CARPINO"
  | "CAGNANO_VARANO"
  | "SAN_NICANDRO_GARGANICO"
  | "LESINA"
  | "MATTINATA"
  | "MONTE_SANT_ANGELO"
  | "MANFREDONIA"
  | "SAN_GIOVANNI_ROTONDO"
  | "SAN_MARCO_IN_LAMIS"
  | "RIGNANO_GARGANICO"
  | "ISOLE_TREMITI";