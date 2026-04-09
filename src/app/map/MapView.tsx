"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Next.js/Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Location {
  id: string;
  item: string;
  lat: number;
  lng: number;
  time: Date | string;
}

export default function MapView({ locations }: { locations: Location[] }) {
  const center: [number, number] = locations.length > 0
    ? [locations[0].lat, locations[0].lng]
    : [20.5937, 78.9629]; // Default: India center

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden relative z-0 border border-white/10 shadow-2xl">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]} icon={icon}>
            <Popup>
              <strong>{loc.item}</strong><br />
              Reported: {new Date(loc.time).toLocaleDateString()}<br />
              Time: {new Date(loc.time).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
