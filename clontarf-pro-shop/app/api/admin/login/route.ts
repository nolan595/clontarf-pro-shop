import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD not set" },
      { status: 500 }
    );
  }

  if (typeof password !== "string" || password !== adminPassword) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const cookieStore = await cookies();

  cookieStore.set("admin_authed", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return NextResponse.json({ ok: true });
}
