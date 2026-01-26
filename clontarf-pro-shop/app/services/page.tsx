import { prisma } from "@/lib/prisma";
import ServicesClient from "./ServicesClient";
import { unstable_cache } from "next/cache";

export const runtime = "nodejs";
export const revalidate = 60;

const getServices = unstable_cache(
  async () => {
    return prisma.service.findMany({
      orderBy:  { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        cloudinary_public_id: true,
      },
    });
  },
  ["service:list"],
  { revalidate: 60 }
);

export default async function ServicesPage() {
  const services = await getServices();

  const safeServices = services.map((p) => ({
    ...p,
    price: p.price
  }));

  return <ServicesClient services={safeServices} />;
}
