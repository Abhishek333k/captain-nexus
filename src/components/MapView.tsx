import React, { useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Polygon,
  Popup,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { City } from '../data/cities';
import { CityOffice } from '../data/offices';

interface MapProps {
  cities: City[];
  offices?: CityOffice[];
  searchedLocation: { name: string; lat: number; lng: number } | null;
  radiusKm: number;
  onSelectCity?: (city: City) => void;
  onSelectOffice?: (office: CityOffice) => void;
  showSurgeHexagons?: boolean;
  activeTab?: 'cities' | 'offices';
}

function generateHexagonVertices(lat: number, lng: number, radiusKm: number): [number, number][] {
  const points: [number, number][] = [];
  const radiusLat = radiusKm / 110.574;
  const radiusLng = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    points.push([
      lat + radiusLat * Math.sin(angle),
      lng + radiusLng * Math.cos(angle)
    ]);
  }
  return points;
}

// Safely fly/pan the map without calling getBounds on an unprojected circle
function MapViewController({
  center,
  radiusKm
}: {
  center: [number, number] | null;
  radiusKm: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!center) return;

    // Calculate approximate bounding box in degrees without relying on unmounted layer projection
    const latDelta = (radiusKm * 1.2) / 110.574;
    const lngDelta = (radiusKm * 1.2) / (111.32 * Math.cos((center[0] * Math.PI) / 180));

    const southWest: [number, number] = [center[0] - latDelta, center[1] - lngDelta];
    const northEast: [number, number] = [center[0] + latDelta, center[1] + lngDelta];

    try {
      map.fitBounds([southWest, northEast], { padding: [40, 40], maxZoom: 12, animate: true });
    } catch {
      map.setView(center, 10);
    }
  }, [center, radiusKm, map]);

  return null;
}

export const MapView: React.FC<MapProps> = ({
  cities,
  offices = [],
  searchedLocation,
  radiusKm,
  onSelectCity,
  onSelectOffice,
  showSurgeHexagons = true,
  activeTab = 'cities'
}) => {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    });
  }, []);

  const searchCenter = useMemo<[number, number] | null>(() => {
    if (!searchedLocation) return null;
    return [searchedLocation.lat, searchedLocation.lng];
  }, [searchedLocation]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden shadow-inner border border-slate-800">
      <MapContainer
        center={[21.0, 78.5]}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {searchCenter && (
          <>
            <Marker position={searchCenter}>
              <Popup>
                <div className="text-xs text-slate-800">
                  <span className="font-bold block text-sm">📍 Searched Reference Point</span>
                  {searchedLocation?.name}
                </div>
              </Popup>
            </Marker>

            <Circle
              center={searchCenter}
              radius={radiusKm * 1000}
              pathOptions={{
                color: '#F59E0B',
                fillColor: '#FBBF24',
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '6, 6'
              }}
            />
          </>
        )}

        {/* City Markers */}
        {(activeTab === 'cities' || activeTab === undefined) &&
          cities.map((city) => {
            const isInside = (city.distance ?? 999) <= radiusKm;
            const hexCoords = generateHexagonVertices(city.lat, city.lng, 8.5);

            return (
              <React.Fragment key={city.id}>
                {showSurgeHexagons && city.active && (
                  <Polygon
                    positions={hexCoords}
                    pathOptions={{
                      color: isInside ? '#10B981' : '#F59E0B',
                      fillColor: isInside ? '#34D399' : '#FBBF24',
                      fillOpacity: 0.18,
                      weight: 1
                    }}
                  />
                )}

                <Marker
                  position={[city.lat, city.lng]}
                  eventHandlers={{
                    click: () => onSelectCity?.(city)
                  }}
                >
                  <Popup>
                    <div className="text-slate-900 text-xs p-1">
                      <div className="font-bold text-sm text-amber-700">{city.name}</div>
                      <div className="text-slate-500 font-medium mb-1">{city.state}</div>
                      {city.distance !== undefined && (
                        <div className="font-semibold text-slate-700 mb-1">
                          Distance:{' '}
                          <span className={isInside ? 'text-emerald-700' : 'text-slate-600'}>
                            {city.distance} km
                          </span>{' '}
                          {isInside ? '🟢 Eligible' : '⚪ Out of range'}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {city.services.map((svc) => (
                          <span
                            key={svc}
                            className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold"
                          >
                            {svc.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

        {/* City Office Walk-in Markers */}
        {offices.map((office) => {
          const isNearby = (office.distance ?? 999) <= radiusKm;
          return (
            <Marker
              key={office.id}
              position={[office.lat, office.lng]}
              eventHandlers={{
                click: () => onSelectOffice?.(office)
              }}
            >
              <Popup>
                <div className="text-slate-900 text-xs p-1 max-w-[220px]">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                      Walk-in Hub
                    </span>
                    <span className="font-bold text-sm text-blue-950 truncate">{office.name}</span>
                  </div>
                  <div className="text-slate-600 text-[11px] mb-1 leading-snug">{office.address}</div>
                  <div className="text-slate-500 text-[10px] font-medium mb-1">
                    PIN: {office.pincode} • Timing: {office.timing}
                  </div>
                  {office.distance !== undefined && (
                    <div className="font-bold text-slate-800 text-xs mt-1 border-t border-slate-200 pt-1">
                      Distance: <span className={isNearby ? 'text-emerald-700' : 'text-blue-700'}>{office.distance} km</span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapViewController center={searchCenter} radiusKm={radiusKm} />
      </MapContainer>
    </div>
  );
};
