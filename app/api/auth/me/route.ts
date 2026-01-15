import { NextResponse } from "next/server";
import { getSessionUserFromCookies } from "@/lib/server/auth";

export async function GET() {
  const user = await getSessionUserFromCookies();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ success: true, data: user });
}
