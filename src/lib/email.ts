import { Resend } from "resend";
import { SITE_URL, SITE_HOST } from "@/lib/site";

// Mittente configurabile: finché il dominio studiovetrina.it non è verificato
// su Resend, resta onboarding@resend.dev (che consegna solo all'owner).
// Dopo la verifica: impostare RESEND_FROM="Studio Vetrina <noreply@studiovetrina.it>"
const MITTENTE =
  process.env.RESEND_FROM ?? "Studio Vetrina <onboarding@resend.dev>";

function escHtml(str: string | null): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailWrapper(content: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #F3EEE4; border-radius: 16px; overflow: hidden;">
      <div style="background: #1B1A18; padding: 28px 32px;">
        <span style="color: #F3EEE4; font-size: 22px; font-weight: 500; letter-spacing: -0.5px; font-family: Georgia, serif;">Studio Vetrina</span>
      </div>
      <div style="padding: 40px 32px;">
        ${content}
      </div>
      <div style="background: rgba(27,26,24,0.06); padding: 18px 32px; text-align: center;">
        <p style="font-size: 12px; color: #8A8578; margin: 0;">
          Studio Vetrina · Roma · <a href="${SITE_URL}" style="color: #8A8578; text-decoration: underline;">${SITE_HOST}</a>
        </p>
      </div>
    </div>
  `;
}

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
      from: MITTENTE,
      to: process.env.RESEND_TO_EMAIL ?? process.env.ADMIN_EMAIL!,
      subject: `Nuovo contatto: ${escHtml(attivita)}`,
      html: emailWrapper(`
        <h2 style="font-size: 22px; color: #1B1A18; margin: 0 0 24px 0; font-weight: 500; font-family: Georgia, serif;">Nuovo contatto dal sito</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #8A8578; width: 120px; font-size: 13px;">Nome</td><td style="padding: 8px 0; font-size: 14px; color: #1B1A18;">${escHtml(nome)}</td></tr>
          <tr><td style="padding: 8px 0; color: #8A8578; font-size: 13px;">Attività</td><td style="padding: 8px 0; font-size: 14px; color: #1B1A18;">${escHtml(attivita)}</td></tr>
          <tr><td style="padding: 8px 0; color: #8A8578; font-size: 13px;">Email</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${escHtml(email)}" style="color: #BF4D2C;">${escHtml(email)}</a></td></tr>
          ${telefono ? `<tr><td style="padding: 8px 0; color: #8A8578; font-size: 13px;">Telefono</td><td style="padding: 8px 0; font-size: 14px; color: #1B1A18;">${escHtml(telefono)}</td></tr>` : ""}
          ${messaggio ? `<tr><td style="padding: 8px 0; color: #8A8578; font-size: 13px; vertical-align: top;">Messaggio</td><td style="padding: 8px 0; font-size: 14px; color: #1B1A18; line-height: 1.6;">${escHtml(messaggio)}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; color: #8A8578; font-size: 13px;">Partner</td><td style="padding: 8px 0; font-size: 14px; color: #1B1A18;">${escHtml(codicePartner) || "Diretto"}</td></tr>
        </table>
      `),
    });
  } catch {
    // L'email non blocca il flusso
  }
}

export async function inviaEmailBenvenutoPartner({
  nome,
  email,
  codice,
  linkPartner,
}: {
  nome: string;
  email: string;
  codice: string;
  linkPartner: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const primoNome = nome.split(" ")[0];

  try {
    await resend.emails.send({
      from: MITTENTE,
      to: email,
      subject: `Benvenuto nel Programma Partner, ${escHtml(primoNome)}!`,
      html: emailWrapper(`
        <h1 style="font-size: 26px; color: #1B1A18; margin: 0 0 16px 0; font-weight: 500; font-family: Georgia, serif;">
          Ciao, ${escHtml(primoNome)}.
        </h1>
        <p style="font-size: 15px; color: #8A8578; line-height: 1.7; margin: 0 0 32px 0;">
          Sei ufficialmente nel Programma Partner di Studio Vetrina.<br/>
          Da oggi ogni attività che ci presenti vale il <strong style="color: #1B1A18;">10% di commissione</strong>.
        </p>

        <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center;">
          <p style="font-size: 11px; color: #8A8578; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 10px 0;">Il tuo codice referral</p>
          <p style="font-size: 38px; color: #1B1A18; font-weight: 500; letter-spacing: 0.12em; margin: 0; font-family: Georgia, serif;">${escHtml(codice)}</p>
        </div>

        <div style="text-align: center; margin-bottom: 36px;">
          <a href="${escHtml(linkPartner)}" style="display: inline-block; background: #BF4D2C; color: #F3EEE4; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 500;">
            Vai alla tua area partner →
          </a>
        </div>

        <div style="border-top: 1px solid rgba(27,26,24,0.1); padding-top: 24px;">
          <p style="font-size: 11px; color: #8A8578; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 14px 0;">Come funziona</p>
          <p style="font-size: 14px; color: #1B1A18; margin: 0 0 10px 0; line-height: 1.5;">01 · Condividi il tuo codice o QR con le attività che conosci</p>
          <p style="font-size: 14px; color: #1B1A18; margin: 0 0 10px 0; line-height: 1.5;">02 · Le attività ci contattano, noi facciamo il lavoro</p>
          <p style="font-size: 14px; color: #1B1A18; margin: 0; line-height: 1.5;">03 · Quando il progetto viene pagato, guadagni il 10%</p>
        </div>
      `),
    });
  } catch {
    // non blocca il flusso
  }
}

export async function inviaEmailStatoSegnalazione({
  partnerEmail,
  partnerNome,
  nomeAttivita,
  statoNuovo,
  commissioneMaturata,
}: {
  partnerEmail: string;
  partnerNome: string;
  nomeAttivita: string;
  statoNuovo: string;
  commissioneMaturata?: number;
}) {
  if (!process.env.RESEND_API_KEY) return;
  if (!["firmato", "pagato", "rifiutato"].includes(statoNuovo)) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const siteUrl = SITE_URL;
  const primoNome = partnerNome.split(" ")[0];
  const attivitaEsc = escHtml(nomeAttivita);

  const subjects: Record<string, string> = {
    firmato: `Ottima notizia: "${attivitaEsc}" ha firmato! 🎉`,
    pagato: `Hai guadagnato €${commissioneMaturata?.toLocaleString("it-IT") ?? "—"} da "${attivitaEsc}"`,
    rifiutato: `Aggiornamento sulla segnalazione "${attivitaEsc}"`,
  };

  const bodies: Record<string, string> = {
    firmato: `
      <h1 style="font-size: 26px; color: #1B1A18; margin: 0 0 16px 0; font-weight: 500; font-family: Georgia, serif;">
        Ottima notizia, ${escHtml(primoNome)}.
      </h1>
      <p style="font-size: 15px; color: #8A8578; line-height: 1.7; margin: 0 0 28px 0;">
        La tua segnalazione ha firmato il contratto. La commissione è in maturazione e verrà liquidata al completamento del progetto.
      </p>
      <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center;">
        <p style="font-size: 11px; color: #8A8578; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 8px 0;">Segnalazione firmata</p>
        <p style="font-size: 24px; color: #BF4D2C; font-weight: 500; margin: 0; font-family: Georgia, serif;">${attivitaEsc}</p>
      </div>
      <div style="text-align: center;">
        <a href="${siteUrl}/partner/area-partner" style="display: inline-block; background: #1B1A18; color: #F3EEE4; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 500;">
          Vedi i tuoi guadagni →
        </a>
      </div>
    `,
    pagato: `
      <h1 style="font-size: 26px; color: #1B1A18; margin: 0 0 16px 0; font-weight: 500; font-family: Georgia, serif;">
        Hai guadagnato, ${escHtml(primoNome)}.
      </h1>
      <p style="font-size: 15px; color: #8A8578; line-height: 1.7; margin: 0 0 28px 0;">
        Il progetto è stato pagato. La tua commissione è maturata ed è pronta per essere liquidata.
      </p>
      <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center;">
        <p style="font-size: 11px; color: #8A8578; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 8px 0;">Commissione maturata</p>
        <p style="font-size: 40px; color: #1B1A18; font-weight: 500; margin: 0 0 4px 0; font-family: Georgia, serif;">€ ${commissioneMaturata?.toLocaleString("it-IT") ?? "—"}</p>
        <p style="font-size: 14px; color: #8A8578; margin: 0;">da ${attivitaEsc}</p>
      </div>
      <div style="text-align: center;">
        <a href="${siteUrl}/partner/area-partner" style="display: inline-block; background: #BF4D2C; color: #F3EEE4; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 500;">
          Vedi i tuoi guadagni →
        </a>
      </div>
    `,
    rifiutato: `
      <h1 style="font-size: 26px; color: #1B1A18; margin: 0 0 16px 0; font-weight: 500; font-family: Georgia, serif;">
        Aggiornamento, ${escHtml(primoNome)}.
      </h1>
      <p style="font-size: 15px; color: #8A8578; line-height: 1.7; margin: 0 0 28px 0;">
        La segnalazione <strong style="color: #1B1A18;">${attivitaEsc}</strong> non è andata a buon fine questa volta. Non preoccuparti: continua a condividere il tuo codice, ogni nuova segnalazione è una nuova opportunità.
      </p>
      <div style="text-align: center;">
        <a href="${siteUrl}/partner/area-partner" style="display: inline-block; background: #1B1A18; color: #F3EEE4; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 500;">
          Vai alla tua area partner →
        </a>
      </div>
    `,
  };

  try {
    await resend.emails.send({
      from: MITTENTE,
      to: partnerEmail,
      subject: subjects[statoNuovo],
      html: emailWrapper(bodies[statoNuovo]),
    });
  } catch {
    // non blocca il flusso
  }
}
