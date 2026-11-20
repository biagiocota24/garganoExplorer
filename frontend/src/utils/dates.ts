const relativeFormatter = new Intl.RelativeTimeFormat("it-IT", {
  numeric: "auto",
});

const fullFormatter = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "long",
  timeStyle: "short",
});

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

// "adesso", "5 minuti fa", "ieri", "2 settimane fa", "3 mesi fa"...
export const formatRelativeTime = (isoDate: string): string => {
  const seconds = (new Date(isoDate).getTime() - Date.now()) / 1000;
  for (const [unit, secondsInUnit] of UNITS) {
    if (Math.abs(seconds) >= secondsInUnit) {
      return relativeFormatter.format(Math.round(seconds / secondsInUnit), unit);
    }
  }
  return "adesso";
};

// "20 novembre 2026 alle ore 10:30"
export const formatFullDate = (isoDate: string): string =>
  fullFormatter.format(new Date(isoDate));
