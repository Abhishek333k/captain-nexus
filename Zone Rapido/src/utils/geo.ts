/**
 * Calculates Great-Circle distance between two coordinates in kilometers using Haversine formula.
 * Used for instant, zero-latency ranking while road distances resolve.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

// In-memory cache for road distances across user interactions
const roadDistanceCache = new Map<string, number>();

/**
 * Calculates Driving Road Distance (km) between coordinates using free Open Source Routing Machine (OSRM) API.
 * Returns null if network fails or route cannot be found.
 */
export async function fetchRoadDistance(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<number | null> {
  const cacheKey = `${startLat.toFixed(4)},${startLng.toFixed(4)}->${endLat.toFixed(4)},${endLng.toFixed(4)}`;
  if (roadDistanceCache.has(cacheKey)) {
    return roadDistanceCache.get(cacheKey)!;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=false`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await res.json();
    if (data?.routes?.[0]?.distance) {
      const dist = Number((data.routes[0].distance / 1000).toFixed(1));
      roadDistanceCache.set(cacheKey, dist);
      return dist;
    }
    return null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Calculates Driving Road Distances in bulk using OSRM Table API.
 * Given one origin and multiple destinations, returns road distances in km.
 */
export async function fetchBulkRoadDistances(
  originLat: number,
  originLng: number,
  destinations: { id: string; lat: number; lng: number }[]
): Promise<Record<string, number>> {
  if (destinations.length === 0) return {};

  const results: Record<string, number> = {};
  const pendingDestinations: { id: string; lat: number; lng: number }[] = [];

  // Check cache first
  for (const d of destinations) {
    const cacheKey = `${originLat.toFixed(4)},${originLng.toFixed(4)}->${d.lat.toFixed(4)},${d.lng.toFixed(4)}`;
    if (roadDistanceCache.has(cacheKey)) {
      results[d.id] = roadDistanceCache.get(cacheKey)!;
    } else {
      pendingDestinations.push(d);
    }
  }

  if (pendingDestinations.length === 0) {
    return results;
  }

  // Process pending in chunks of 25 to respect URL length and API limits
  const chunkSize = 25;

  for (let i = 0; i < pendingDestinations.length; i += chunkSize) {
    const chunk = pendingDestinations.slice(i, i + chunkSize);
    const coords = [`${originLng},${originLat}`, ...chunk.map((d) => `${d.lng},${d.lat}`)].join(';');
    const url = `https://router.project-osrm.org/table/v1/driving/${coords}?sources=0&annotations=distance`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data?.code === 'Ok' && Array.isArray(data.distances?.[0])) {
        const row = data.distances[0];
        chunk.forEach((d, idx) => {
          const meters = row[idx + 1];
          if (typeof meters === 'number' && meters !== null) {
            const dist = Number((meters / 1000).toFixed(1));
            results[d.id] = dist;
            const cacheKey = `${originLat.toFixed(4)},${originLng.toFixed(4)}->${d.lat.toFixed(4)},${d.lng.toFixed(4)}`;
            roadDistanceCache.set(cacheKey, dist);
          }
        });
      }
    } catch {
      clearTimeout(timeoutId);
      // Fallback silently for this chunk
    }
  }

  return results;
}
