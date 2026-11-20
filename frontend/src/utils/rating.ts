const ratingFormatter = new Intl.NumberFormat("it-IT", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

// 4.25 → "4,3"
export const formatRating = (value: number): string =>
  ratingFormatter.format(Math.min(Math.max(value, 0), 5));

// 1 → "1 recensione", 12 → "12 recensioni"
export const formatReviewCount = (count: number): string =>
  `${count} ${count === 1 ? "recensione" : "recensioni"}`;
