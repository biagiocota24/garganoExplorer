// PER LE RECENSIONI
const relativeFormatterReview = new Intl.RelativeTimeFormat("it-IT", {
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

export function formatRelativeTimeReview(isoDate: string): string {
  const seconds = (new Date(isoDate).getTime() - Date.now()) / 1000;
  for (const [unit, secondsInUnit] of UNITS) {
    if (Math.abs(seconds) >= secondsInUnit) {
      return relativeFormatterReview.format(
        Math.round(seconds / secondsInUnit),
        unit,
      );
    }
  }
  return "adesso";
}

export function formatFullDateReview(isoDate: string): string {
  return fullFormatter.format(new Date(isoDate));
}

// PER LE NOTIFICHE
export const relativeFormatterNotification = new Intl.RelativeTimeFormat("it", {
  numeric: "auto",
});

// "adesso", "5 minuti fa", "2 ore fa", "ieri", poi la data
export const formatRelativeTimeNotification = (iso: string): string => {
  const diffSeconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const abs = Math.abs(diffSeconds);

  if (abs < 60) return "adesso";
  if (abs < 3600)
    return relativeFormatterNotification.format(Math.round(diffSeconds / 60), "minute");
  if (abs < 86400)
    return relativeFormatterNotification.format(Math.round(diffSeconds / 3600), "hour");
  if (abs < 7 * 86400)
    return relativeFormatterNotification.format(Math.round(diffSeconds / 86400), "day");

  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatFullDateNotification = (iso: string): string =>
  new Date(iso).toLocaleString("it-IT", {
    dateStyle: "full",
    timeStyle: "short",
  });
