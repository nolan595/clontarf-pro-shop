import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST() {
  await sendEmail({
    to: "markjnolan00@gmail.com", // change this
    subject: "Brevo test 🚀",
    html: "<p>If you’re reading this, Brevo is live.</p>",
  });

  return NextResponse.json({ ok: true });
}
