import { TTLCache } from "@/lib/server/ttl-cache";
import { hasSmtpConfig, sendEmail } from "@/lib/server/email";
import { getSupabaseAdminClient, hasSupabaseServiceConfig } from "@/lib/server/supabase";

type OrderLike = {
  id: number;
  customer?: any;
  items?: any[];
  subtotal?: number;
  discount?: number;
  shipping?: number;
  total?: number;
  promoCode?: string | null;
  paymentMethod?: string;
  status?: string;
  createdAt?: string;
};

const perRecipientThrottle = new TTLCache<string, { count: number }>(60 * 60_000, 5_000);
const perOrderDedup = new TTLCache<string, true>(24 * 60 * 60_000, 10_000);

function normalizeEmail(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.trim().toLowerCase();
}

function isEmail(input: string) {
  if (!input || input.length > 200) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

function clampText(input: unknown, max = 2000) {
  const s = typeof input === "string" ? input : JSON.stringify(input ?? "");
  return s.length > max ? s.slice(0, max) : s;
}

function formatMoneyVnd(amount: number | undefined) {
  const n = typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
  } catch {
    return `${n} VND`;
  }
}

function renderOrderText(order: OrderLike) {
  const lines: string[] = [];
  lines.push(`Order #${order.id}`);
  if (order.status) lines.push(`Status: ${order.status}`);
  if (order.paymentMethod) lines.push(`Payment: ${order.paymentMethod}`);
  lines.push("");

  const items = Array.isArray(order.items) ? order.items : [];
  if (items.length) {
    lines.push("Items:");
    for (const it of items.slice(0, 30)) {
      const name = clampText(it?.name ?? it?.title ?? "Item", 120);
      const qty = Number(it?.quantity ?? 1) || 1;
      const price = typeof it?.price === "number" ? it.price : Number(it?.price ?? 0);
      lines.push(`- ${name} x${qty} (${formatMoneyVnd(price)})`);
    }
    if (items.length > 30) lines.push(`...and ${items.length - 30} more`);
    lines.push("");
  }

  lines.push(`Subtotal: ${formatMoneyVnd(order.subtotal)}`);
  lines.push(`Discount: ${formatMoneyVnd(order.discount)}`);
  lines.push(`Shipping: ${formatMoneyVnd(order.shipping)}`);
  lines.push(`Total: ${formatMoneyVnd(order.total)}`);
  return lines.join("\n");
}

function renderOrderHtml(order: OrderLike) {
  const items = Array.isArray(order.items) ? order.items : [];
  const rows = items
    .slice(0, 30)
    .map((it) => {
      const name = clampText(it?.name ?? it?.title ?? "Item", 120);
      const qty = Number(it?.quantity ?? 1) || 1;
      const price = typeof it?.price === "number" ? it.price : Number(it?.price ?? 0);
      return `<tr>
        <td style="padding:8px 0">${escapeHtml(name)}</td>
        <td style="padding:8px 0; text-align:right">x${qty}</td>
        <td style="padding:8px 0; text-align:right">${escapeHtml(formatMoneyVnd(price))}</td>
      </tr>`;
    })
    .join("");

  const status = order.status ? escapeHtml(order.status) : "pending";
  const pay = order.paymentMethod ? escapeHtml(order.paymentMethod) : "cod";

  return `
  <div style="font-family: ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial; line-height:1.5; color:#111">
    <div style="max-width:680px;margin:0 auto; padding:20px">
      <h2 style="margin:0 0 6px">Techmart order confirmation</h2>
      <div style="color:#555;margin-bottom:14px">Order <b>#${order.id}</b> • Status: <b>${status}</b> • Payment: <b>${pay}</b></div>

      <div style="border:1px solid #e5e7eb; border-radius:12px; padding:14px">
        <table style="width:100%; border-collapse:collapse">
          <thead>
            <tr>
              <th style="text-align:left; font-size:12px; color:#6b7280; padding:6px 0">Item</th>
              <th style="text-align:right; font-size:12px; color:#6b7280; padding:6px 0">Qty</th>
              <th style="text-align:right; font-size:12px; color:#6b7280; padding:6px 0">Price</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="3" style="padding:10px 0; color:#6b7280">(No items)</td></tr>`}
          </tbody>
        </table>

        <div style="border-top:1px solid #e5e7eb; margin-top:12px; padding-top:12px">
          <table style="width:100%; border-collapse:collapse">
            <tr><td style="color:#6b7280">Subtotal</td><td style="text-align:right">${escapeHtml(formatMoneyVnd(order.subtotal))}</td></tr>
            <tr><td style="color:#6b7280">Discount</td><td style="text-align:right">-${escapeHtml(formatMoneyVnd(order.discount))}</td></tr>
            <tr><td style="color:#6b7280">Shipping</td><td style="text-align:right">${escapeHtml(formatMoneyVnd(order.shipping))}</td></tr>
            <tr><td style="padding-top:8px"><b>Total</b></td><td style="padding-top:8px; text-align:right"><b>${escapeHtml(formatMoneyVnd(order.total))}</b></td></tr>
          </table>
        </div>
      </div>

      <div style="margin-top:14px; font-size:12px; color:#6b7280">
        This is an automated message. If you did not place this order, you can ignore it.
      </div>
    </div>
  </div>
  `.trim();
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function recordEventOrSkip(params: { orderId: number; type: string; toEmail: string; payload: any }) {
  const key = `${params.orderId}:${params.type}:${params.toEmail}`;

  // Always dedup in-memory too (helps even without DB)
  if (perOrderDedup.get(key)) return { shouldSend: false, reason: "duplicate" as const };

  if (hasSupabaseServiceConfig) {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("notification_events")
      .insert([
        {
          order_id: params.orderId,
          type: params.type,
          to_email: params.toEmail,
          payload: params.payload ?? {},
        },
      ]);

    if (error) {
      // Unique violation or already exists => do not send
      const msg = String((error as any)?.message ?? "");
      if (msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("unique")) {
        perOrderDedup.set(key, true);
        return { shouldSend: false, reason: "duplicate" as const };
      }
      // If DB logging fails for other reasons, still send (but keep throttle)
    }
  }

  perOrderDedup.set(key, true);
  return { shouldSend: true, reason: "new" as const };
}

function checkRecipientThrottle(toEmail: string) {
  const key = toEmail;
  const entry = perRecipientThrottle.get(key) || { count: 0 };
  if (entry.count >= 3) return false; // max 3 emails / hour / recipient
  perRecipientThrottle.set(key, { count: entry.count + 1 });
  return true;
}

export async function sendOrderConfirmationEmail(order: OrderLike) {
  if (!hasSmtpConfig()) return { sent: false, reason: "smtp_not_configured" as const };

  const toEmail = normalizeEmail(order.customer?.email);
  if (!isEmail(toEmail)) return { sent: false, reason: "no_email" as const };

  if (!checkRecipientThrottle(toEmail)) return { sent: false, reason: "throttled" as const };

  const event = await recordEventOrSkip({
    orderId: order.id,
    type: "order_confirmation",
    toEmail,
    payload: {
      status: order.status,
      paymentMethod: order.paymentMethod,
      total: order.total,
    },
  });
  if (!event.shouldSend) return { sent: false, reason: event.reason };

  const subject = `Techmart – Order #${order.id} confirmation`;
  const text = renderOrderText(order);

  await sendEmail({ to: toEmail, subject, text: text, html: renderOrderHtml(order) });
  return { sent: true as const };
}

export async function sendOrderStatusEmail(order: OrderLike, status: string) {
  if (!hasSmtpConfig()) return { sent: false, reason: "smtp_not_configured" as const };

  const toEmail = normalizeEmail(order.customer?.email);
  if (!isEmail(toEmail)) return { sent: false, reason: "no_email" as const };

  if (!checkRecipientThrottle(toEmail)) return { sent: false, reason: "throttled" as const };

  const type = `order_status_${String(status).toLowerCase()}`;
  const event = await recordEventOrSkip({
    orderId: order.id,
    type,
    toEmail,
    payload: { status },
  });
  if (!event.shouldSend) return { sent: false, reason: event.reason };

  const subject = `Techmart – Order #${order.id} update: ${status}`;
  const text = `Order #${order.id}\nStatus: ${status}\n\n${renderOrderText(order)}`;
  await sendEmail({ to: toEmail, subject, text, html: renderOrderHtml({ ...order, status }) });

  return { sent: true as const };
}
