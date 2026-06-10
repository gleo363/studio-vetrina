// Unica fonte di verità per l'URL del sito.
// NEXT_PUBLIC_SITE_URL (Vercel) vince sul fallback: finché il dominio Aruba
// non è attivo la env resta sul dominio vercel.app; al momento dello switch
// basta aggiornare la env var e tutto (metadata, sitemap, email, referral)
// commuta insieme.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://studiovetrina.it";

// Versione senza protocollo, per testi visibili (footer email, OG image).
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
