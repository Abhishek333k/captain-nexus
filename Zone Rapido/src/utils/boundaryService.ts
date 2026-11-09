/**
 * Service to fetch, cache, and test administrative municipal boundaries (GeoJSON)
 * using free OpenStreetMap Nominatim polygons with local caching.
 */

import { PRECOMPUTED_CITY_BOUNDARIES } from '../data/boundaries';

export interface CityBoundary {
  cityName: string;
  geojson: any;
  cachedAt: number;
}

const CACHE_KEY_PREFIX = 'captain_nexus_boundary_';

export async function fetchCityBoundary(cityId: string, cityName: string, stateName: string): Promise<any> {
  const normalizedId = (cityId || cityName).toLowerCase().trim().replace(/[^a-z0-9]+/g, '_');
  const cacheKey = `${CACHE_KEY_PREFIX}${normalizedId}`;

  // 1. Check precomputed boundaries first for instant zero-latency accuracy
  if (PRECOMPUTED_CITY_BOUNDARIES[cityId] || PRECOMPUTED_CITY_BOUNDARIES[normalizedId]) {
    return PRECOMPUTED_CITY_BOUNDARIES[cityId] || PRECOMPUTED_CITY_BOUNDARIES[normalizedId];
  }

  // 2. Check localStorage cache for high-res boundary
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed: CityBoundary = JSON.parse(cached);
      if (Date.now() - parsed.cachedAt < 30 * 24 * 60 * 60 * 1000) {
        return parsed.geojson;
      }
    }
  } catch {
    // Local storage unavailable
  }

  // 3. Query OpenStreetMap Nominatim for official boundary polygon
  const cleanName = cityName.split('(')[0].trim();
  const searchQueries = [
    `${cleanName} Municipal Corporation, ${stateName}, India`,
    `${cleanName} District, ${stateName}, India`,
    `Greater ${cleanName}, ${stateName}, India`,
    `${cleanName}, ${stateName}, India`
  ];

  for (const query of searchQueries) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&limit=1&q=${encodeURIComponent(
        query
      )}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'CaptainNexus/1.0' } });
      const data = await res.json();
      if (
        Array.isArray(data) &&
        data[0]?.geojson &&
        (data[0].geojson.type === 'Polygon' || data[0].geojson.type === 'MultiPolygon')
      ) {
        const geojson = data[0].geojson;
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              cityName,
              geojson,
              cachedAt: Date.now()
            })
          );
        } catch {
          // Storage quota handled
        }
        return geojson;
      }
    } catch {
      // Continue to next query variant
    }
  }

  // 3. Fallback: Always return instant precomputed boundary for the city
  return PRECOMPUTED_CITY_BOUNDARIES[cityId] || null;
}

/**
 * Standard ray-casting algorithm to test if a point [lng, lat] is inside a polygon ring
 */
function pointInLinearRing(point: [number, number], ring: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];

    const intersect =
      yi > point[1] !== yj > point[1] &&
      point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Checks whether [lat, lng] is strictly inside a Polygon or MultiPolygon GeoJSON geometry
 */
export function isPointInsideGeoJSON(lat: number, lng: number, geojson: any): boolean {
  if (!geojson || !geojson.type || !geojson.coordinates) return false;
  const point: [number, number] = [lng, lat];

  if (geojson.type === 'Polygon') {
    // Outer ring is coordinates[0], holes are coordinates[1..N]
    const outerRing = geojson.coordinates[0];
    if (!pointInLinearRing(point, outerRing)) return false;

    // Check if point falls in any hole
    for (let h = 1; h < geojson.coordinates.length; h++) {
      if (pointInLinearRing(point, geojson.coordinates[h])) {
        return false;
      }
    }
    return true;
  }

  if (geojson.type === 'MultiPolygon') {
    for (const poly of geojson.coordinates) {
      const outerRing = poly[0];
      if (pointInLinearRing(point, outerRing)) {
        let inHole = false;
        for (let h = 1; h < poly.length; h++) {
          if (pointInLinearRing(point, poly[h])) {
            inHole = true;
            break;
          }
        }
        if (!inHole) return true;
      }
    }
  }

  return false;
}

