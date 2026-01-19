import { NextResponse } from "next/server";
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit";
import {
  getSupabaseAdminClient,
  getSupabasePublicClient,
  hasSupabasePublicConfig,
  hasSupabaseServiceConfig,
} from "@/lib/server/supabase";

export async function GET() {
	// Check if Supabase is configured
	if (!hasSupabaseServiceConfig && !hasSupabasePublicConfig) {
		return NextResponse.json(
			{ success: false, error: "Database not configured. Please set up Supabase credentials." },
			{ status: 500 }
		);
	}

	const supabase = hasSupabaseServiceConfig ? getSupabaseAdminClient() : getSupabasePublicClient();
	
	const { data, error } = await supabase
		.from("discounts")
		.select("*")
		.eq("is_active", true)
		.order("id", { ascending: true });

	if (error) {
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}

	// Map database fields to match frontend expectations
	const mapped = (data || []).map((d) => ({
		id: d.id,
		title: d.title,
		description: d.description,
		code: d.code,
		discount: d.discount_value,
		validUntil: d.valid_until,
		image: d.image,
		type: d.discount_type,
		minPurchase: d.min_purchase,
	}));

	return NextResponse.json({ success: true, data: mapped, total: mapped.length });
}

export async function POST(request: Request) {
	try {
		const ip = getRequestIp(request);
		const rl = await rateLimit({ key: `discount:apply:${ip}`, limit: 30, windowMs: 60_000 });
		if (!rl.allowed) {
			const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
			return NextResponse.json(
				{ success: false, error: "Too many requests" },
				{ status: 429, headers: { "Retry-After": String(retryAfter) } },
			);
		}

		const body = await request.json();

		if (!body?.code) {
			return NextResponse.json({ success: false, error: "code required" }, { status: 400 });
		}

		const codeRaw = String(body.code);
		if (codeRaw.length > 64) {
			return NextResponse.json({ success: false, error: "Invalid code" }, { status: 400 });
		}

		const code = codeRaw.trim().toUpperCase();
		if (!code || !/^[A-Z0-9_-]+$/.test(code)) {
			return NextResponse.json({ success: false, error: "Invalid code" }, { status: 400 });
		}

		// Check if Supabase is configured
		if (!hasSupabaseServiceConfig && !hasSupabasePublicConfig) {
			return NextResponse.json(
				{ success: false, error: "Database not configured. Please set up Supabase credentials." },
				{ status: 500 }
			);
		}

		const supabase = hasSupabaseServiceConfig ? getSupabaseAdminClient() : getSupabasePublicClient();

		// Find discount by code
		const { data, error } = await supabase
			.from("discounts")
			.select("*")
			.eq("code", code)
			.eq("is_active", true)
			.single();

		if (error || !data) {
			return NextResponse.json({ success: false, error: "Invalid discount code" }, { status: 404 });
		}

		// Map database fields to match frontend expectations
		const discount = {
			id: data.id,
			title: data.title,
			description: data.description,
			code: data.code,
			discount: data.discount_value,
			validUntil: data.valid_until,
			image: data.image,
			type: data.discount_type,
			minPurchase: data.min_purchase,
		};

		return NextResponse.json({ success: true, data: discount });
	} catch {
		return NextResponse.json({ success: false, error: "Failed to apply discount" }, { status: 500 });
	}
}
