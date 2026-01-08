import { NextResponse } from "next/server";
import { getCheckout } from "@/lib/sumup";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const checkout = await getCheckout(params.id);
  return NextResponse.json(checkout);
}
