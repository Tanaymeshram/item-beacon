import DynamicMap from '@/components/DynamicMap';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function GlobalMap() {
  const user = await getUserFromCookie();
  if (!user) {
    redirect("/login");
  }

  // Fetch all reports for items owned by the user
  const userItems = await prisma.item.findMany({
    where: { ownerId: user.userId },
    include: {
      reports: true
    }
  });

  const locations = userItems.flatMap((item: any) => 
    item.reports
      .filter((r: any) => r.locationLat && r.locationLng)
      .map((r: any) => ({
        id: r.id,
        item: item.name,
        lat: r.locationLat as number,
        lng: r.locationLng as number,
        time: r.createdAt
      }))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Lost & Found Radar</h1>
        <p className="text-muted-foreground mt-1">See where your items were last scanned or reported.</p>
      </div>

      <div className="glass-card p-4 rounded-2xl shadow-sm border border-border">
        {locations.length > 0 ? (
          <DynamicMap locations={locations} />
        ) : (
          <div className="h-[400px] flex items-center justify-center flex-col text-muted-foreground bg-muted/30 rounded-xl">
            <h3 className="text-xl font-bold mb-2 text-foreground">No Locations Recorded</h3>
            <p className="max-w-md text-center">Your items have not been scanned or reported yet, so there is no location data to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}
