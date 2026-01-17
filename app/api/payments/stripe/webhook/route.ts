import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getSupabaseAdminClient, hasSupabaseServiceConfig } from "@/lib/server/supabase";
import { getStripeClient, getStripeWebhookSecret, hasStripeConfig } from "@/lib/server/stripe";
import { sendOrderStatusEmail } from "@/lib/server/order-notifications";

export const runtime = "nodejs";

function mapDbOrder(row: any) {
  return {
    id: Number(row.id),
    customer: row.customer ?? {},
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: typeof row.subtotal === "number" ? row.subtotal : row.subtotal ? Number(row.subtotal) : 0,
    discount: typeof row.discount === "number" ? row.discount : row.discount ? Number(row.discount) : 0,
    shipping: typeof row.shipping === "number" ? row.shipping : row.shipping ? Number(row.shipping) : 0,
    total: typeof row.total === "number" ? row.total : row.total ? Number(row.total) : 0,
    promoCode: typeof row.promo_code === "string" ? row.promo_code : null,
    paymentMethod: typeof row.payment_method === "string" ? row.payment_method : "cod",
    status: typeof row.status === "string" ? row.status : "pending",
    createdAt: typeof row.created_at === "string" ? row.created_at : new Date().toISOString(),
  };
}

async function markOrderPaid(orderId: number, sessionId: string) {
  if (!hasSupabaseServiceConfig) return;
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      payment_provider: "stripe",
      payment_reference: sessionId,
    })
    .eq("id", orderId)
    .select(
      "id,customer,items,subtotal,discount,shipping,total,promo_code,payment_method,status,created_at,updated_at,user_id",
    )
    .maybeSingle();

  if (error || !data) return;

  try {
    await sendOrderStatusEmail(mapDbOrder(data), "paid");
  } catch {
    // ignore
  }
}

export async function POST(request: Request) {
  try {
    if (!hasStripeConfig()) {
      return NextResponse.json({ success: false, error: "Stripe is not configured" }, { status: 503 });
    }
    if (!hasSupabaseServiceConfig) {
      return NextResponse.json({ success: false, error: "DB is required for Stripe payments" }, { status: 503 });
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ success: false, error: "Missing stripe-signature" }, { status: 400 });
    }

    const body = await request.text();
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(body, signature, getStripeWebhookSecret());

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = Number(session?.metadata?.order_id);
      if (Number.isFinite(orderId) && orderId > 0) {
        await markOrderPaid(orderId, String(session.id));
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Webhook error" }, { status: 400 });
  }
}
