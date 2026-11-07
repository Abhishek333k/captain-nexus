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

// Custom Distinct Icons for Markers
const createCustomIcon = (bgColor: string, symbol: string) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background: ${bgColor};
        color: #0b0d10;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        border: 2px solid #ffffff;
      ">
        <span style="
          transform: rotate(45deg);
          font-weight: 900;
          font-size: 14px;
        ">${symbol}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });
};

const cityIcon = createCustomIcon('#F9C80E', 'R');
const headOfficeIcon = createCustomIcon('#3B82F6', '🏢');
const registeredOfficeIcon = createCustomIcon('#8B5CF6', '🏛️');
const corporateCampusIcon = createCustomIcon('#10B981', '🏬');
const regionalSupportIcon = createCustomIcon('#06B6D4', '📍');
const searchLocationIcon = createCustomIcon('#EF4444', '🎯');

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
  const searchCenter = useMemo<[number, number] | null>(() => {
    if (!searchedLocation) return null;
    return [searchedLocation.lat, searchedLocation.lng];
  }, [searchedLocation]);

  const getOfficeIcon = (type: CityOffice['type']) => {
    switch (type) {
      case 'head_office':
        return headOfficeIcon;
      case 'registered_office':
        return registeredOfficeIcon;
      case 'corporate_campus':
        return corporateCampusIcon;
      default:
        return regionalSupportIcon;
    }
  };

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
            <Marker position={searchCenter} icon={searchLocationIcon}>
              <Popup>
                <div className="text-xs text-slate-800">
                  <span className="font-bold block text-sm text-rose-700">🎯 Captain Target Point</span>
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

        {/* Official Servicing City Markers */}
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
                  icon={cityIcon}
                  eventHandlers={{
                    click: () => onSelectCity?.(city)
                  }}
                >
                  <Popup>
                    <div className="text-slate-900 text-xs p-1">
                      <div className="flex items-center space-x-1 mb-1">
                        <span className="bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-bold text-[9px] uppercase">
                          Official City Hub
                        </span>
                        <div className="font-bold text-sm text-amber-800">{city.name}</div>
                      </div>
                      <div className="text-slate-500 font-medium mb-1">{city.state}</div>
                      {city.distance !== undefined && (
                        <div className="font-semibold text-slate-700 mb-1">
                          Distance:{' '}
                          <span className={isInside ? 'text-emerald-700 font-bold' : 'text-slate-600'}>
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

        {/* Corporate & Registered Office Markers */}
        {offices.map((office) => {
          const isNearby = (office.distance ?? 999) <= radiusKm;
          return (
            <Marker
              key={office.id}
              position={[office.lat, office.lng]}
              icon={getOfficeIcon(office.type)}
              eventHandlers={{
                click: () => onSelectOffice?.(office)
              }}
            >
              <Popup>
                <div className="text-slate-900 text-xs p-1 max-w-[240px]">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                      {office.type.replace('_', ' ')}
                    </span>
                    <span className="font-bold text-sm text-blue-950 truncate">{office.name}</span>
                  </div>
                  <div className="text-slate-700 text-[11px] mb-1 leading-snug">{office.address}</div>
                  <div className="text-slate-500 text-[10px] font-medium mb-1">
                    PIN: {office.pincode} • Timing: {office.timing}
                  </div>
                  <div className="text-[9px] text-blue-700 font-semibold mb-1">
                    Source: {office.verificationSource}
                  </div>
                  {office.distance !== undefined && (
                    <div className="font-bold text-slate-800 text-xs mt-1 border-t border-slate-200 pt-1">
                      Distance: <span className={isNearby ? 'text-emerald-700 font-bold' : 'text-blue-700'}>{office.distance} km</span>
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
