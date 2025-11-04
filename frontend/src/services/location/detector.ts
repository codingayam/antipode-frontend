export interface DeviceLocation {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
}

export interface DetectorOptions {
  timeoutMs?: number;
  enableHighAccuracy?: boolean;
}

const DEFAULT_TIMEOUT_MS = 10_000;

export function supportsGeolocation(): boolean {
  return typeof window !== 'undefined' && 'geolocation' in navigator;
}

export function detectDeviceLocation(
  options: DetectorOptions = {},
): Promise<DeviceLocation> {
  if (!supportsGeolocation()) {
    return Promise.reject(new Error('Geolocation not supported in this environment.'));
  }

  const { timeoutMs = DEFAULT_TIMEOUT_MS, enableHighAccuracy = true } = options;

  return new Promise<DeviceLocation>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
        });
      },
      (error) => {
        reject(
          new Error(
            error.message || 'Unable to retrieve device location. Please try manual search.',
          ),
        );
      },
      {
        timeout: timeoutMs,
        enableHighAccuracy,
        maximumAge: 1000 * 30,
      },
    );
  });
}
