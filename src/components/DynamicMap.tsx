"use client";

import dynamic from 'next/dynamic';

interface Location {
  id: string;
  item: string;
  lat: number;
  lng: number;
  time: Date | string;
}

const MapView = dynamic(() => import('@/app/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-muted flex items-center justify-center rounded-xl animate-pulse text-muted-foreground">
      Loading Map...
    </div>
  ),
});

export default function DynamicMap({ locations }: { locations: Location[] }) {
  return <MapView locations={locations} />;
}
