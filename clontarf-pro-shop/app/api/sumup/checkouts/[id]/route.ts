import { NextResponse, type NextRequest } from "next/server";
import { getCheckout } from "@/lib/sumup";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const checkout = await getCheckout(id);
  return NextResponse.json(checkout);
}
