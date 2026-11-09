/**
 * Chiede a Cloudinary una versione ridimensionata e compressa dell'immagine.
 * q_auto = qualità automatica, f_auto = formato migliore per il browser (es. WebP/AVIF).
 */
export function optimizedImage(url: string, width: number, height?: number): string {
  if (!url.includes("/image/upload/")) return url;

  const size = height ? `w_${width},h_${height},c_fill` : `w_${width},c_limit`;
  return url.replace("/image/upload/", `/image/upload/${size},q_auto,f_auto/`);
}