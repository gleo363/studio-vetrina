import { Resend } from "resend";

export async function inviaEmailContatto({
  nome,
  attivita,
  email,
  telefono,
  messaggio,
  codicePartner,
}: {
  nome: string;
  attivita: string;
  email: string;
  telefono: string | null;
  messaggio: string | null;
  codicePartner: string | null;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Vetrina <onboarding@resend.dev>",
      to: process.env.RESEND_TO_EMAIL ?? process.env.ADMIN_EMAIL!,
      subject: `Nuovo contatto: ${attivita}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px;">
          <h2 style="margin-bottom: 24px;">Nuovo contatto dal sito</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; width: 120px;">Nome</td><td style="padding: 8px 0;">${nome}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Attività</td><td style="padding: 8px 0;">${attivita}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            ${telefono ? `<tr><td style="padding: 8px 0; color: #888;">Telefono</td><td style="padding: 8px 0;">${telefono}</td></tr>` : ""}
            ${messaggio ? `<tr><td style="padding: 8px 0; color: #888; vertical-align: top;">Messaggio</td><td style="padding: 8px 0;">${messaggio}</td></tr>` : ""}
            <tr><td style="padding: 8px 0; color: #888;">Partner</td><td style="padding: 8px 0;">${codicePartner ?? "Diretto"}</td></tr>
          </table>
        </div>
      `,
    });
  } catch {
    // L'email non blocca il flusso
  }
}
