import { Resend } from "resend";
import { SITE_URL, SITE_HOST } from "@/lib/site";
import { LOCALE_INTL, type Lingua } from "@/lib/i18n/config";

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

function emailWrapper(content: string, lingua: Lingua = "it"): string {
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
          Studio Vetrina · ${lingua === "en" ? "Rome" : "Roma"} · <a href="${SITE_URL}" style="color: #8A8578; text-decoration: underline;">${SITE_HOST}</a>
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
  lingua,
}: {
  nome: string;
  attivita: string;
  email: string;
  telefono: string | null;
  messaggio: string | null;
  codicePartner: string | null;
  /** Lingua in cui il visitatore ha usato il sito: rispondere in questa. */
  lingua: Lingua;
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
          <tr><td style="padding: 8px 0; color: #8A8578; font-size: 13px;">Lingua</td><td style="padding: 8px 0; font-size: 14px; color: #1B1A18;">${lingua === "en" ? "Inglese · rispondere in inglese" : "Italiano"}</td></tr>
        </table>
      `),
    });
  } catch {
    // L'email non blocca il flusso
  }
}

const TESTI_BENVENUTO = {
  it: {
    oggetto: (n: string) => `Benvenuto nel Programma Partner, ${n}!`,
    saluto: (n: string) => `Ciao, ${n}.`,
    intro:
      'Sei ufficialmente nel Programma Partner di Studio Vetrina.<br/>Da oggi ogni attività che ci presenti vale il <strong style="color: #1B1A18;">10% di commissione</strong>.',
    codice: "Il tuo codice referral",
    cta: "Vai alla tua area partner →",
    comeFunziona: "Come funziona",
    passi: [
      "01 · Condividi il tuo codice o QR con le attività che conosci",
      "02 · Le attività ci contattano, noi facciamo il lavoro",
      "03 · Quando il progetto viene pagato, guadagni il 10%",
    ],
  },
  en: {
    oggetto: (n: string) => `Welcome to the Partner Program, ${n}!`,
    saluto: (n: string) => `Hi, ${n}.`,
    intro:
      'You\'re officially part of the Studio Vetrina Partner Program.<br/>From today, every business you bring us earns you a <strong style="color: #1B1A18;">10% commission</strong>.',
    codice: "Your referral code",
    cta: "Go to your partner area →",
    comeFunziona: "How it works",
    passi: [
      "01 · Share your code or QR with businesses you know",
      "02 · They get in touch, we do the work",
      "03 · When the project is paid, you earn 10%",
    ],
  },
};

export async function inviaEmailBenvenutoPartner({
  nome,
  email,
  codice,
  linkPartner,
  lingua,
}: {
  nome: string;
  email: string;
  codice: string;
  linkPartner: string;
  lingua: Lingua;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const primoNome = nome.split(" ")[0];
  const t = TESTI_BENVENUTO[lingua];

  try {
    await resend.emails.send({
      from: MITTENTE,
      to: email,
      subject: t.oggetto(escHtml(primoNome)),
      html: emailWrapper(`
        <h1 style="font-size: 26px; color: #1B1A18; margin: 0 0 16px 0; font-weight: 500; font-family: Georgia, serif;">
          ${t.saluto(escHtml(primoNome))}
        </h1>
        <p style="font-size: 15px; color: #8A8578; line-height: 1.7; margin: 0 0 32px 0;">
          ${t.intro}
        </p>

        <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center;">
          <p style="font-size: 11px; color: #8A8578; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 10px 0;">${t.codice}</p>
          <p style="font-size: 38px; color: #1B1A18; font-weight: 500; letter-spacing: 0.12em; margin: 0; font-family: Georgia, serif;">${escHtml(codice)}</p>
        </div>

        <div style="text-align: center; margin-bottom: 36px;">
          <a href="${escHtml(linkPartner)}" style="display: inline-block; background: #BF4D2C; color: #F3EEE4; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 500;">
            ${t.cta}
          </a>
        </div>

        <div style="border-top: 1px solid rgba(27,26,24,0.1); padding-top: 24px;">
          <p style="font-size: 11px; color: #8A8578; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 14px 0;">${t.comeFunziona}</p>
          <p style="font-size: 14px; color: #1B1A18; margin: 0 0 10px 0; line-height: 1.5;">${t.passi[0]}</p>
          <p style="font-size: 14px; color: #1B1A18; margin: 0 0 10px 0; line-height: 1.5;">${t.passi[1]}</p>
          <p style="font-size: 14px; color: #1B1A18; margin: 0; line-height: 1.5;">${t.passi[2]}</p>
        </div>
      `, lingua),
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
  lingua = "it",
}: {
  lingua?: Lingua;
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

  const importo = commissioneMaturata?.toLocaleString(LOCALE_INTL[lingua]) ?? "—";
  const nomeEsc = escHtml(primoNome);
  const it = lingua === "it";

  const subjects: Record<string, string> = it
    ? {
        firmato: `Ottima notizia: "${attivitaEsc}" ha firmato! 🎉`,
        pagato: `Hai guadagnato €${importo} da "${attivitaEsc}"`,
        rifiutato: `Aggiornamento sulla segnalazione "${attivitaEsc}"`,
      }
    : {
        firmato: `Great news: "${attivitaEsc}" has signed! 🎉`,
        pagato: `You've earned €${importo} from "${attivitaEsc}"`,
        rifiutato: `An update on your referral "${attivitaEsc}"`,
      };

  const t = it
    ? {
        firmatoTitolo: `Ottima notizia, ${nomeEsc}.`,
        firmatoTesto:
          "La tua segnalazione ha firmato il contratto. La commissione è in maturazione e verrà liquidata al completamento del progetto.",
        firmatoEtichetta: "Segnalazione firmata",
        vediGuadagni: "Vedi i tuoi guadagni →",
        pagatoTitolo: `Hai guadagnato, ${nomeEsc}.`,
        pagatoTesto:
          "Il progetto è stato pagato. La tua commissione è maturata ed è pronta per essere liquidata.",
        pagatoEtichetta: "Commissione maturata",
        da: "da",
        rifiutatoTitolo: `Aggiornamento, ${nomeEsc}.`,
        rifiutatoTesto: `La segnalazione <strong style="color: #1B1A18;">${attivitaEsc}</strong> non è andata a buon fine questa volta. Non preoccuparti: continua a condividere il tuo codice, ogni nuova segnalazione è una nuova opportunità.`,
        areaPartner: "Vai alla tua area partner →",
      }
    : {
        firmatoTitolo: `Great news, ${nomeEsc}.`,
        firmatoTesto:
          "The business you referred has signed the contract. Your commission is on its way and will be paid out once the project is complete.",
        firmatoEtichetta: "Referral signed",
        vediGuadagni: "See your earnings →",
        pagatoTitolo: `You've earned it, ${nomeEsc}.`,
        pagatoTesto:
          "The project has been paid. Your commission is confirmed and ready to be paid out.",
        pagatoEtichetta: "Commission earned",
        da: "from",
        rifiutatoTitolo: `An update, ${nomeEsc}.`,
        rifiutatoTesto: `Your referral <strong style="color: #1B1A18;">${attivitaEsc}</strong> didn't work out this time. Don't let it stop you: keep sharing your code. Every new referral is a new chance.`,
        areaPartner: "Go to your partner area →",
      };

  const bodies: Record<string, string> = {
    firmato: `
      <h1 style="font-size: 26px; color: #1B1A18; margin: 0 0 16px 0; font-weight: 500; font-family: Georgia, serif;">
        ${t.firmatoTitolo}
      </h1>
      <p style="font-size: 15px; color: #8A8578; line-height: 1.7; margin: 0 0 28px 0;">
        ${t.firmatoTesto}
      </p>
      <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center;">
        <p style="font-size: 11px; color: #8A8578; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 8px 0;">${t.firmatoEtichetta}</p>
        <p style="font-size: 24px; color: #BF4D2C; font-weight: 500; margin: 0; font-family: Georgia, serif;">${attivitaEsc}</p>
      </div>
      <div style="text-align: center;">
        <a href="${siteUrl}/partner/area-partner" style="display: inline-block; background: #1B1A18; color: #F3EEE4; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 500;">
          ${t.vediGuadagni}
        </a>
      </div>
    `,
    pagato: `
      <h1 style="font-size: 26px; color: #1B1A18; margin: 0 0 16px 0; font-weight: 500; font-family: Georgia, serif;">
        ${t.pagatoTitolo}
      </h1>
      <p style="font-size: 15px; color: #8A8578; line-height: 1.7; margin: 0 0 28px 0;">
        ${t.pagatoTesto}
      </p>
      <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center;">
        <p style="font-size: 11px; color: #8A8578; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 8px 0;">${t.pagatoEtichetta}</p>
        <p style="font-size: 40px; color: #1B1A18; font-weight: 500; margin: 0 0 4px 0; font-family: Georgia, serif;">€ ${importo}</p>
        <p style="font-size: 14px; color: #8A8578; margin: 0;">${t.da} ${attivitaEsc}</p>
      </div>
      <div style="text-align: center;">
        <a href="${siteUrl}/partner/area-partner" style="display: inline-block; background: #BF4D2C; color: #F3EEE4; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 500;">
          ${t.vediGuadagni}
        </a>
      </div>
    `,
    rifiutato: `
      <h1 style="font-size: 26px; color: #1B1A18; margin: 0 0 16px 0; font-weight: 500; font-family: Georgia, serif;">
        ${t.rifiutatoTitolo}
      </h1>
      <p style="font-size: 15px; color: #8A8578; line-height: 1.7; margin: 0 0 28px 0;">
        ${t.rifiutatoTesto}
      </p>
      <div style="text-align: center;">
        <a href="${siteUrl}/partner/area-partner" style="display: inline-block; background: #1B1A18; color: #F3EEE4; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 500;">
          ${t.areaPartner}
        </a>
      </div>
    `,
  };

  try {
    await resend.emails.send({
      from: MITTENTE,
      to: partnerEmail,
      subject: subjects[statoNuovo],
      html: emailWrapper(bodies[statoNuovo], lingua),
    });
  } catch {
    // non blocca il flusso
  }
}
