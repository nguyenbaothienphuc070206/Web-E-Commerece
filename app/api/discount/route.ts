import { NextResponse } from "next/server";
import { DISCOUNTS } from "@/lib/constants";
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit";

export async function GET() {
	return NextResponse.json({ success: true, data: DISCOUNTS, total: DISCOUNTS.length });
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
		const discount = DISCOUNTS.find((d) => d.code.toUpperCase() === code);

		if (!discount) {
			return NextResponse.json({ success: false, error: "Invalid discount code" }, { status: 404 });
		}

		return NextResponse.json({ success: true, data: discount });
	} catch {
		return NextResponse.json({ success: false, error: "Failed to apply discount" }, { status: 500 });
	}
}
