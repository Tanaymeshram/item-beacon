import prisma from "@/lib/prisma";
import PublicItemView from "./PublicItemView";

export default async function ItemPublicPage({ params }: { params: { id: string } }) {
  // Await the params
  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: { id },
  });

  if (!item) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-muted-foreground">Item not found or has been unregistered.</p>
        </div>
      </div>
    );
  }

  // Pass it to a client component to handle location and user interactions
  return <PublicItemView item={item} />;
}
