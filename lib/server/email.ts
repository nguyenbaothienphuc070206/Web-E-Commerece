import nodemailer from "nodemailer";

function getEnv(name: string) {
  return (process.env[name] || "").trim();
}

export function hasSmtpConfig() {
  return Boolean(getEnv("SMTP_HOST") && getEnv("SMTP_PORT") && getEnv("SMTP_USER") && getEnv("SMTP_PASS"));
}

function parsePort(input: string) {
  const n = Number(input);
  if (!Number.isFinite(n) || n <= 0 || n > 65535) throw new Error("Invalid SMTP_PORT");
  return n;
}

function shouldUseSecure(port: number, explicit: string) {
  if (explicit) return explicit === "true" || explicit === "1";
  // Common default: port 465 is implicit TLS.
  return port === 465;
}

function getFromAddress() {
  return getEnv("SMTP_FROM") || getEnv("SMTP_USER");
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
  const host = getEnv("SMTP_HOST");
  const port = parsePort(getEnv("SMTP_PORT"));
  const user = getEnv("SMTP_USER");
  const pass = getEnv("SMTP_PASS");
  const from = getFromAddress();
  const secure = shouldUseSecure(port, getEnv("SMTP_SECURE"));

  if (!host || !user || !pass) {
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
