import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getUserFromCookie } from "@/lib/auth";
import QRDisplay from "./QRDisplay";

export default async function QRPage({ params }: { params: { id: string } }) {
  const user = await getUserFromCookie();
  if (!user) {
    redirect("/login");
  }

  // Await the params since Next.js 15 requires awaiting dynamic route params
  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: { id },
  });

  if (!item) {
    return <div className="p-8 text-center">Item not found</div>;
  }

  // Make sure they own it
  if (item.ownerId !== user.userId) {
    return <div className="p-8 text-center text-red-500">Unauthorized</div>;
  }

  // Render client component for QR interactive bits
  return <QRDisplay item={item} />;
}
