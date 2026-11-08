/**
 * Service to fetch, cache, and test administrative municipal boundaries (GeoJSON)
 * using free OpenStreetMap Nominatim polygons with local caching.
 */

export interface CityBoundary {
  cityName: string;
  geojson: any;
  cachedAt: number;
}

const CACHE_KEY_PREFIX = 'captain_nexus_boundary_';

export async function fetchCityBoundary(cityName: string, stateName: string): Promise<any | null> {
  const cacheKey = `${CACHE_KEY_PREFIX}${cityName.toLowerCase().replace(/\s+/g, '_')}`;

  // 1. Check localStorage cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed: CityBoundary = JSON.parse(cached);
      // Cache valid for 30 days
      if (Date.now() - parsed.cachedAt < 30 * 24 * 60 * 60 * 1000) {
        return parsed.geojson;
      }
    }
  } catch {
    // Local storage unavailable or corrupt; continue to fetch
  }

  // 2. Fetch official municipal border polygon from OpenStreetMap Nominatim
  const cleanName = cityName.split('(')[0].trim();
  const query = `${cleanName}, ${stateName}, India`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&limit=1&q=${encodeURIComponent(
    query
  )}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data) && data[0]?.geojson) {
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
        // Handle storage quota limits gracefully
      }
      return geojson;
    }
  } catch {
    return null;
  }

  return null;
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
