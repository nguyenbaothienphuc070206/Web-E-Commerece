import { NextResponse } from "next/server";
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit";
import { getSupabaseAdminClient, hasSupabaseServiceConfig } from "@/lib/server/supabase";
import { getStripeClient, hasStripeConfig } from "@/lib/server/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const rl = await rateLimit({ key: `stripe:checkout:${ip}`, limit: 20, windowMs: 60_000 });
    if (!rl.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }

    if (!hasStripeConfig()) {
      return NextResponse.json({ success: false, error: "Stripe is not configured" }, { status: 503 });
    }
    if (!hasSupabaseServiceConfig) {
      return NextResponse.json({ success: false, error: "DB is required for Stripe payments" }, { status: 503 });
    }

    const body = await request.json();
    const orderId = Number(body?.orderId);
    if (!Number.isFinite(orderId) || orderId <= 0) {
      return NextResponse.json({ success: false, error: "Invalid orderId" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data: order, error } = await supabase
      .from("orders")
      .select("id,total,status,payment_method,customer")
      .eq("id", orderId)
      .maybeSingle();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

    const paymentMethod = String(order.payment_method || "");
    if (paymentMethod !== "stripe") {
      return NextResponse.json({ success: false, error: "Order is not Stripe payment" }, { status: 400 });
    }

    const status = String(order.status || "");
    if (status === "paid") {
      return NextResponse.json({ success: false, error: "Order is already paid" }, { status: 409 });
    }

    const total = typeof order.total === "number" ? order.total : Number(order.total || 0);
    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json({ success: false, error: "Invalid order total" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "";
    if (!origin) {
      return NextResponse.json({ success: false, error: "Missing Origin" }, { status: 400 });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "vnd",
            unit_amount: Math.round(total),
            product_data: {
              name: `Techmart Order #${orderId}`,
            },
          },
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=1`,
      metadata: {
        order_id: String(orderId),
        customer_email: String(order?.customer?.email || ""),
      },
    });

    if (session?.id) {
      await supabase
        .from("orders")
        .update({ payment_provider: "stripe", payment_reference: session.id })
        .eq("id", orderId);
    }

    if (!session.url) {
      return NextResponse.json({ success: false, error: "Stripe session missing URL" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { url: session.url, id: session.id } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Stripe error" }, { status: 500 });
  }
}
