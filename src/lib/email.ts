import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";

/**
 * Email transport.
 *
 * Uses SMTP when configured (production); otherwise logs the message and
 * returns a development link so flows remain testable in local/dev without
 * a mail server. Never expose `devLink` to end users in production.
 */

const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export interface SendEmailInput {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  /** Absolute link used only for dev logging. */
  devLink?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<{ devLink?: string }> {
  const from = process.env.EMAIL_FROM ?? `no-reply@${new URL(siteConfig.url).hostname}`;

  if (!smtpConfigured) {
    // Development fallback — log for the operator.
    console.log(
      `\n📧 [dev-email] to=${input.to}\n   subject=${input.subject}\n${input.text ? `   text=${input.text}\n` : ""}${input.devLink ? `   link=${input.devLink}\n` : ""}`
    );
    return { devLink: input.devLink };
  }

  await transporter!.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });

  return {};
}
