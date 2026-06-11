// Unico punto di verità per il check admin. Confronto case-insensitive:
// le email sono case-insensitive per standard, un mismatch di maiuscole
// non deve né bloccare l'admin né (peggio) far passare nessun altro.
export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !email) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}
