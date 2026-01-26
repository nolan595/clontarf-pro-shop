import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type DbService = Awaited<ReturnType<typeof prisma.service.findMany>>[number];
type ServiceDTO = Omit<DbService, "price"> & { price: number };

function toDTO(p: DbService): ServiceDTO {
  return { ...p, price: p.price };
}

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(services.map(toDTO));
}

export async function POST(req: NextRequest) {
  const body: Partial<{
    name: string;
    description: string | null;
    price: number;
    cloudinary_public_id: string;
  }> = await req.json();

  if (!body.name || typeof body.price !== "number") {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }

  try {
    const created = await prisma.service.create({
      data: {
        name: body.name,
        description: body.description ?? null,
        price: body.price,
        cloudinary_public_id: body.cloudinary_public_id,
      },
    });

    return NextResponse.json(toDTO(created));
  } catch (err) {
    console.error("POST /api/services failed:", err);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
