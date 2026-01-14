import { NextResponse } from "next/server";
import { DISCOUNTS } from "@/lib/constants";

export async function GET() {
	return NextResponse.json({ success: true, data: DISCOUNTS, total: DISCOUNTS.length });
}

export async function POST(request: Request) {
	try {
		const body = await request.json();

		if (!body?.code) {
			return NextResponse.json({ success: false, error: "code required" }, { status: 400 });
		}

		const code = String(body.code).trim().toUpperCase();
		const discount = DISCOUNTS.find((d) => d.code.toUpperCase() === code);

		if (!discount) {
			return NextResponse.json({ success: false, error: "Invalid discount code" }, { status: 404 });
		}

		return NextResponse.json({ success: true, data: discount });
	} catch {
		return NextResponse.json({ success: false, error: "Failed to apply discount" }, { status: 500 });
	}
}
