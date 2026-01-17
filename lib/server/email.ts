import nodemailer from "nodemailer";
import { getServerEnv, hasSmtpEnv } from "@/lib/server/env";

export function hasSmtpConfig() {
  return hasSmtpEnv();
}

function shouldUseSecure(port: number, explicit: boolean | undefined) {
  if (typeof explicit === "boolean") return explicit;
  // Common default: port 465 is implicit TLS.
  return port === 465;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendEmail(input: { to: string; subject: string; text: string; html?: string }) {
  const env = getServerEnv();
  const host = env.SMTP_HOST || "";
  const port = env.SMTP_PORT || 0;
  const user = env.SMTP_USER || "";
  const pass = env.SMTP_PASS || "";
  const from = (env.SMTP_FROM || env.SMTP_USER || "").trim();
  const secure = shouldUseSecure(port, env.SMTP_SECURE);

  if (!host || !port || !user || !pass) {
    throw new Error("Missing SMTP config (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS)");
  }
  if (!from) {
    throw new Error("Missing SMTP_FROM (or SMTP_USER)");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  // Keep HTML safe (either user-provided template or a minimal fallback).
  const html =
    typeof input.html === "string" && input.html.trim()
      ? input.html
      : `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.5">
          <h2 style="margin:0 0 12px">${escapeHtml(input.subject)}</h2>
          <pre style="white-space:pre-wrap; background:#f7f7f8; padding:12px; border-radius:8px">${escapeHtml(input.text)}</pre>
        </div>
      `.trim();

  const info = await transporter.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html,
  });

  return { messageId: info.messageId };
}
