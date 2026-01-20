import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const ok = cookieStore.get("admin_authed")?.value === "1";
  return NextResponse.json({ ok });
}
