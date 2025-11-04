import { useMutation } from '@tanstack/react-query';
import type {
  AntipodeLocation,
  AntipodeSearchPayload,
  AntipodeSearchResponse,
  DeviceSearchPayload,
} from '../types/antipode';

function computeAntipodeFromDevicePayload(
  payload: DeviceSearchPayload,
): AntipodeLocation {
  const { latitude, longitude } = payload.location.device;

  const antipodeLatitude = latitude === 0 ? 0 : -latitude;
  let antipodeLongitude = longitude + 180;
  if (antipodeLongitude > 180) {
    antipodeLongitude -= 360;
  }
  if (antipodeLongitude <= -180) {
    antipodeLongitude += 360;
  }

  return {
    latitude: Number(antipodeLatitude.toFixed(4)),
    longitude: Number(antipodeLongitude.toFixed(4)),
    label: `Opposite point near ${antipodeLatitude.toFixed(2)}°, ${antipodeLongitude.toFixed(2)}°`,
  };
}

export function useAntipodeSearch() {
  return useMutation<AntipodeSearchResponse, Error, AntipodeSearchPayload>({
    mutationKey: ['antipode-search'],
    mutationFn: async (payload) => {
      if ('device' in payload.location) {
        const antipode = computeAntipodeFromDevicePayload(
          payload as DeviceSearchPayload,
        );
        return {
          antipode,
          listings: [],
          emptyState: 'Sign up to be notified when antipode matches are available.',
          snapshotId: 'local-computation',
        } satisfies AntipodeSearchResponse;
      }

      throw new Error('Manual location search is not yet supported.');
    },
  });
}
