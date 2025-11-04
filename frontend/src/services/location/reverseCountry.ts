import {
  MAPBOX_ACCESS_TOKEN,
  MAPBOX_ACCESS_TOKEN_PLACEHOLDER,
} from '../../config/mapbox';

const SEARCH_RADII_DEGREES = [0, 0.75, 1.5, 3, 6, 10, 14];
const BEARING_SAMPLES = 8;

function clampLatitude(latitude: number) {
  return Math.max(-90, Math.min(90, latitude));
}

function wrapLongitude(longitude: number) {
  if (!Number.isFinite(longitude)) {
    return 0;
  }
  const wrapped = ((longitude + 180) % 360 + 360) % 360 - 180;
  return wrapped === -180 ? 180 : wrapped;
}

function buildReverseGeocodeUrl(longitude: number, latitude: number) {
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
  );
  url.search = new URLSearchParams({
    access_token: MAPBOX_ACCESS_TOKEN,
    types: 'country',
    limit: '1',
  }).toString();
  return url.toString();
}

function generateCandidateCoordinates(
  longitude: number,
  latitude: number,
): Array<[number, number]> {
  const candidates: Array<[number, number]> = [];
  const seen = new Set<string>();

  const pushCandidate = (lon: number, lat: number) => {
    const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    candidates.push([wrapLongitude(lon), clampLatitude(lat)]);
  };

  pushCandidate(longitude, latitude);

  for (const radius of SEARCH_RADII_DEGREES) {
    if (radius === 0) {
      continue;
    }

    for (let index = 0; index < BEARING_SAMPLES; index += 1) {
      const angle = (2 * Math.PI * index) / BEARING_SAMPLES;
      const deltaLat = radius * Math.cos(angle);
      const candidateLat = clampLatitude(latitude + deltaLat);

      const cosLat = Math.cos((candidateLat * Math.PI) / 180);
      const lonScale = Math.max(Math.abs(cosLat), 0.1);
      const deltaLon = (radius * Math.sin(angle)) / lonScale;
      const candidateLon = wrapLongitude(longitude + deltaLon);

      pushCandidate(candidateLon, candidateLat);
    }
  }

  return candidates;
}

async function reverseGeocodeCountry(
  longitude: number,
  latitude: number,
): Promise<string | null> {
  try {
    const response = await fetch(buildReverseGeocodeUrl(longitude, latitude));
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      features?: Array<{
        text?: string;
        place_name?: string;
      }>;
    };

    const feature = data.features?.[0];
    if (!feature) {
      return null;
    }

    return feature.text ?? feature.place_name ?? null;
  } catch {
    return null;
  }
}

export async function fetchCountryForCoordinates(
  longitude: number,
  latitude: number,
): Promise<string | null> {
  const hasToken =
    Boolean(MAPBOX_ACCESS_TOKEN) &&
    MAPBOX_ACCESS_TOKEN !== MAPBOX_ACCESS_TOKEN_PLACEHOLDER;

  if (!hasToken) {
    return null;
  }

  const candidates = generateCandidateCoordinates(longitude, latitude);

  for (const [candidateLongitude, candidateLatitude] of candidates) {
    const country = await reverseGeocodeCountry(
      candidateLongitude,
      candidateLatitude,
    );
    if (country) {
      return country;
    }
  }

  return null;
}
