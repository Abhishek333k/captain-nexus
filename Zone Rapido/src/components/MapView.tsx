import React, { useEffect, useMemo, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Polygon,
  Popup,
  Tooltip,
  GeoJSON,
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { City } from '../data/cities';
import { CityOffice } from '../data/offices';

interface MapProps {
  cities: City[];
  offices?: CityOffice[];
  searchedLocation: { name: string; lat: number; lng: number } | null;
  selectedCity?: City | null;
  radiusKm: number;
  onSelectCity?: (city: City) => void;
  onSelectOffice?: (office: CityOffice) => void;
  onMapClick?: (lat: number, lng: number) => void;
  showSurgeHexagons?: boolean;
  showCityPins?: boolean;
  showOfficePins?: boolean;
  activeTab?: 'cities' | 'offices';
  activeCityBoundary?: any | null;
  selectedCityName?: string | null;
  isCaptainInsideBoundary?: boolean;
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
const inactiveCityIcon = createCustomIcon('#64748B', '•');
const registeredOfficeIcon = createCustomIcon('#8B5CF6', '🏛️');
const corporateCampusIcon = createCustomIcon('#10B981', '🏬');
const searchLocationIcon = createCustomIcon('#EF4444', '📍');

function MapViewController({
  searchCenter,
  selectedCityCenter,
  radiusKm,
  activeCityBoundary
}: {
  searchCenter: [number, number] | null;
  selectedCityCenter: [number, number] | null;
  radiusKm: number;
  activeCityBoundary?: any | null;
}) {
  const map = useMap();

  useEffect(() => {
    // If an official city boundary polygon is active, smoothly fit view to its bounds (Google Maps style)
    if (activeCityBoundary) {
      try {
        const geoLayer = L.geoJSON(activeCityBoundary);
        const bounds = geoLayer.getBounds();
        if (bounds.isValid()) {
          map.flyToBounds(bounds, { padding: [45, 45], maxZoom: 14, duration: 1.2 });
          return;
        }
      } catch (err) {
        console.warn('Could not fit bounds to city boundary:', err);
      }
    }

    // If the user selected an explicit city, prioritize that.
    // Do NOT jump/zoom on arbitrary map point clicks (only on explicit city selection or search).
    const center = selectedCityCenter;
    if (!center) return;

    // Use a tighter focus for single city click, or radius coverage for search location
    const effectiveRadius = selectedCityCenter ? 25 : Math.max(radiusKm, 30);
    const latDelta = (effectiveRadius * 1.3) / 110.574;
    const lngDelta = (effectiveRadius * 1.3) / (111.32 * Math.cos((center[0] * Math.PI) / 180));
    const southWest: [number, number] = [center[0] - latDelta, center[1] - lngDelta];
    const northEast: [number, number] = [center[0] + latDelta, center[1] + lngDelta];

    try {
      map.flyToBounds([southWest, northEast], { padding: [40, 40], maxZoom: 12, duration: 1.2 });
    } catch {
      map.flyTo(center, 11, { duration: 1.2 });
    }
  }, [selectedCityCenter, searchCenter, radiusKm, activeCityBoundary, map]);

  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  const lastGestureRef = useRef<number>(0);

  useMapEvents({
    dragstart() {
      lastGestureRef.current = Date.now();
    },
    dragend() {
      lastGestureRef.current = Date.now();
    },
    zoomstart() {
      lastGestureRef.current = Date.now();
    },
    zoomend() {
      lastGestureRef.current = Date.now();
    },
    click(e) {
      // Guard against accidental clicks firing right after a drag or pinch-zoom gesture
      if (Date.now() - lastGestureRef.current < 350) {
        return;
      }
      onMapClick?.(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export const MapView: React.FC<MapProps> = ({
  cities,
  offices = [],
  searchedLocation,
  selectedCity = null,
  radiusKm,
  onSelectCity,
  onSelectOffice,
  onMapClick,
  showSurgeHexagons = false,
  showCityPins = true,
  showOfficePins = true,
  activeCityBoundary = null,
  selectedCityName = null,
  isCaptainInsideBoundary = false
}) => {
  const searchCenter = useMemo<[number, number] | null>(() => {
    if (!searchedLocation) return null;
    return [searchedLocation.lat, searchedLocation.lng];
  }, [searchedLocation]);

  const selectedCityCenter = useMemo<[number, number] | null>(() => {
    if (!selectedCity) return null;
    return [selectedCity.lat, selectedCity.lng];
  }, [selectedCity]);

  const getOfficeIcon = (type: CityOffice['type']) => {
    return type === 'registered_office' ? registeredOfficeIcon : corporateCampusIcon;
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden shadow-inner border border-slate-800">
      <MapContainer
        center={[21.0, 78.5]}
        zoom={5}
        scrollWheelZoom={true}
        attributionControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamic Municipal City Boundary (GeoJSON Polygon - Google Maps style) */}
        {activeCityBoundary && (
          <GeoJSON
            key={selectedCityName ?? 'active-boundary'}
            data={activeCityBoundary}
            style={() => ({
              color: isCaptainInsideBoundary ? '#10B981' : '#DC2626',
              weight: 2.5,
              opacity: 0.95,
              fillColor: isCaptainInsideBoundary ? '#10B981' : '#EF4444',
              fillOpacity: 0.08
            })}
          />
        )}

        {/* Custom Point / Address Reference Location (Only shown when an official city is NOT selected) */}
        {searchCenter && !selectedCity && (
          <>
            <Marker position={searchCenter} icon={searchLocationIcon}>
              <Popup>
                <div className="text-xs text-slate-800 p-1 select-text">
                  <div className="flex items-center justify-between gap-2 mb-1 border-b border-slate-200 pb-1">
                    <span className="font-bold text-xs text-rose-600 select-text cursor-text">
                      📍 {searchedLocation?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => searchedLocation?.name && copyToClipboard(searchedLocation.name)}
                      className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300 font-semibold cursor-pointer shrink-0"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono select-text cursor-text">
                    Lat: {searchCenter[0].toFixed(4)}, Lng: {searchCenter[1].toFixed(4)}
                  </div>
                  <p className="mt-1 text-slate-600 text-[11px] select-text">
                    Reference point for distance calculations to nearest servicing hubs.
                  </p>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={searchCenter}
              radius={radiusKm * 1000}
              pathOptions={{
                color: '#EF4444',
                fillColor: '#EF4444',
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: '4, 4'
              }}
            />
          </>
        )}

        {/* 1. Official Servicing City Hubs (Toggled by showCityPins) */}
        {showCityPins &&
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
                  icon={city.active ? cityIcon : inactiveCityIcon}
                  eventHandlers={{
                    click: () => onSelectCity?.(city)
                  }}
                >
                  {/* Google Maps-style on-map city label */}
                  <Tooltip
                    direction="top"
                    offset={[0, -28]}
                    opacity={0.95}
                    className="city-map-tooltip"
                  >
                    <span className="select-text cursor-text">
                      {city.name} {!city.active && '(Inactive)'}
                    </span>
                  </Tooltip>

                  <Popup>
                    <div className="text-slate-900 text-xs p-1 min-w-[210px] max-w-[280px] select-text">
                      {/* Header with Copy Action */}
                      <div className="flex items-start justify-between gap-1.5 mb-1.5 pb-1 border-b border-slate-200">
                        <div>
                          <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] uppercase tracking-wider inline-block mb-0.5 ${
                            city.active ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {city.active ? 'Operational Hub' : 'Inactive Service Zone'}
                          </span>
                          <div className="font-bold text-sm text-slate-900 select-text cursor-text leading-tight">
                            {city.name}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(city.name)}
                          title="Copy city name"
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300 font-semibold cursor-pointer shrink-0"
                        >
                          📋 Copy
                        </button>
                      </div>

                      <div className="text-slate-600 font-medium mb-1 select-text cursor-text">
                        State: <span className="font-bold text-slate-800">{city.state}</span>
                      </div>

                      {/* Physical Office Address */}
                      {city.address && (
                        <div className="my-1.5 p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] leading-tight select-text cursor-text">
                          <div className="font-bold text-[10px] text-amber-900 flex items-center justify-between mb-1">
                            <span className="flex items-center space-x-1">
                              <span>🏢</span>
                              <span>{city.additionalOffices && city.additionalOffices.length > 0 ? 'Primary City Office:' : 'City Office:'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(`${city.address}${city.pincode ? ` PIN: ${city.pincode}` : ''}`)}
                              title="Copy address"
                              className="text-[9px] bg-amber-100 hover:bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 font-medium cursor-pointer"
                            >
                              📋 Copy
                            </button>
                          </div>
                          <div className="text-slate-800 select-text leading-snug">{city.address}</div>
                          {city.pincode && (
                            <div className="text-[10px] text-slate-600 font-mono mt-1 select-text">PIN: {city.pincode}</div>
                          )}
                          {city.landmarkNote && (
                            <div className="text-[10px] text-amber-800 italic mt-1 select-text">📍 {city.landmarkNote}</div>
                          )}
                        </div>
                      )}

                      {/* Additional Regional Offices for Major Metros */}
                      {city.additionalOffices && city.additionalOffices.length > 0 && (
                        <div className="space-y-1.5 my-1.5">
                          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                            Additional Regional Hubs ({city.additionalOffices.length}):
                          </div>
                          {city.additionalOffices.map((addOffice, addIdx) => (
                            <div key={addIdx} className="p-2 bg-blue-50/80 rounded-lg border border-blue-200 text-[11px] leading-tight select-text cursor-text">
                              <div className="font-bold text-[10px] text-blue-900 flex items-center justify-between mb-1">
                                <span className="flex items-center space-x-1">
                                  <span>📍</span>
                                  <span>{addOffice.name}</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(`${addOffice.address}${addOffice.pincode ? ` PIN: ${addOffice.pincode}` : ''}`)}
                                  title="Copy address"
                                  className="text-[9px] bg-blue-100 hover:bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded border border-blue-300 font-medium cursor-pointer"
                                >
                                  📋 Copy
                                </button>
                              </div>
                              <div className="text-slate-800 select-text leading-snug">{addOffice.address}</div>
                              {addOffice.pincode && (
                                <div className="text-[10px] text-slate-600 font-mono mt-0.5 select-text">PIN: {addOffice.pincode}</div>
                              )}
                              {addOffice.landmarkNote && (
                                <div className="text-[10px] text-blue-800 italic mt-0.5 select-text">📍 {addOffice.landmarkNote}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Regional Cluster Badge */}
                      {city.clusterName && (
                        <div className="my-1.5 p-2 bg-purple-50 rounded-lg border border-purple-200 text-[11px] leading-tight select-text cursor-text">
                          <div className="font-bold text-[10px] text-purple-900 flex items-center space-x-1 mb-0.5">
                            <span>🌐</span>
                            <span>{city.clusterName}</span>
                          </div>
                          {city.isSubDistrict && (
                            <div className="text-[9px] text-purple-700 font-medium mt-0.5">
                              ⚡ Sub-district municipality with cross-dispatch to parent hub
                            </div>
                          )}
                        </div>
                      )}

                      {/* Coordinates */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono my-1 pt-1 border-t border-slate-100 select-text cursor-text">
                        <span>{city.lat.toFixed(4)}, {city.lng.toFixed(4)}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`${city.lat}, ${city.lng}`)}
                          className="text-[9px] text-slate-600 hover:text-slate-900 underline font-sans cursor-pointer"
                        >
                          Copy Coords
                        </button>
                      </div>

                      {/* Distance status */}
                      {city.distance !== undefined && (
                        <div className="font-semibold text-slate-700 my-1 text-[11px] select-text">
                          Road Distance:{' '}
                          <span className={isInside ? 'text-emerald-700 font-bold' : 'text-slate-600'}>
                            {city.distance} km
                          </span>{' '}
                          <span className="text-[10px] font-normal">
                            ({isInside ? 'Eligible' : 'Out of range'})
                          </span>
                        </div>
                      )}

                      {city.notes && (
                        <div className="text-[10px] text-slate-600 italic mt-1 select-text">
                          Note: {city.notes}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {city.services.map((svc) => (
                          <span
                            key={svc}
                            className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold select-text"
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

        {/* 2. Physical Corporate & Regional Offices (Toggled by showOfficePins) */}
        {showOfficePins &&
          offices.map((office) => {
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
                <Tooltip
                  direction="top"
                  offset={[0, -28]}
                  opacity={0.95}
                  className="city-map-tooltip"
                >
                  <span className="select-text cursor-text">{office.name}</span>
                </Tooltip>

                <Popup>
                  <div className="text-slate-900 text-xs p-1 max-w-[260px] select-text">
                    <div className="flex items-start justify-between gap-1.5 mb-1 pb-1 border-b border-slate-200">
                      <div>
                        <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase inline-block mb-0.5">
                          {office.type.replace('_', ' ')}
                        </span>
                        <div className="font-bold text-sm text-blue-950 select-text cursor-text leading-tight">
                          {office.name}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(office.name)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300 font-semibold cursor-pointer shrink-0"
                      >
                        📋 Copy
                      </button>
                    </div>

                    <div className="text-slate-700 text-[11px] mb-1 leading-snug select-text cursor-text">
                      {office.address}
                    </div>

                    <div className="flex items-center justify-between text-slate-500 text-[10px] font-medium mb-1 select-text">
                      <span>PIN: {office.pincode} • Timing: {office.timing}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`${office.address} PIN: ${office.pincode}`)}
                        className="text-[9px] text-blue-600 hover:text-blue-900 underline cursor-pointer"
                      >
                        Copy Address
                      </button>
                    </div>

                    <div className="flex items-center flex-wrap gap-1.5 text-[10px] mb-1">
                      <span className="text-emerald-700 font-bold">✓ Verified Office Location</span>
                      <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold text-[9px]">Active Serviceable Zone</span>
                    </div>

                    {office.distance !== undefined && (
                      <div className="font-bold text-slate-800 text-xs mt-1 border-t border-slate-200 pt-1 select-text">
                        Road Distance: <span className={isNearby ? 'text-emerald-700 font-bold' : 'text-blue-700'}>{office.distance} km</span>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

        <MapClickHandler onMapClick={onMapClick} />
        <MapViewController
          searchCenter={searchCenter}
          selectedCityCenter={selectedCityCenter}
          radiusKm={radiusKm}
          activeCityBoundary={activeCityBoundary}
        />
      </MapContainer>
    </div>
  );
};
