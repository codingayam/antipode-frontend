import { useCallback, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import {
  MAPBOX_ACCESS_TOKEN,
  MAPBOX_ACCESS_TOKEN_PLACEHOLDER,
} from '../../config/mapbox';

export interface AntipodePoint {
  latitude: number;
  longitude: number;
  label?: string;
}

export interface AntipodeGlobeProps {
  antipode?: AntipodePoint;
  isAnimating?: boolean;
  height?: number | string;
  layoutKey?: string;
}

const TOKEN_PLACEHOLDER = MAPBOX_ACCESS_TOKEN_PLACEHOLDER;
const SECONDS_PER_REVOLUTION = 120;
const MAX_SPIN_ZOOM = 5;
const SLOW_SPIN_ZOOM = 3;
const DEFAULT_CENTER: [number, number] = [-90, 40];

export function AntipodeGlobe({
  antipode,
  isAnimating = true,
  height = 320,
  layoutKey,
}: AntipodeGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const isSpinningRef = useRef<boolean>(false);
  const userInteractingRef = useRef<boolean>(false);
  const hasValidToken =
    Boolean(MAPBOX_ACCESS_TOKEN) && MAPBOX_ACCESS_TOKEN !== TOKEN_PLACEHOLDER;

  const isSpinning = isAnimating && hasValidToken;

  const spinGlobe = useCallback(() => {
    const map = mapRef.current;
    if (!map || !isSpinningRef.current) {
      return;
    }

    const zoom = map.getZoom();
    if (zoom >= MAX_SPIN_ZOOM || userInteractingRef.current) {
      return;
    }

    let distancePerSecond = 360 / SECONDS_PER_REVOLUTION;
    if (zoom > SLOW_SPIN_ZOOM) {
      const zoomDiff = (MAX_SPIN_ZOOM - zoom) / (MAX_SPIN_ZOOM - SLOW_SPIN_ZOOM);
      distancePerSecond *= zoomDiff;
    }

    const { lng, lat } = map.getCenter().wrap();
    const nextLng = lng - distancePerSecond;

    map.easeTo({
      center: [nextLng, lat],
      duration: 1000,
      easing: (n) => n,
    });
  }, []);

  useEffect(() => {
    if (!hasValidToken || !containerRef.current) {
      return;
    }

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/standard-satellite',
      zoom: 1.5,
      center: DEFAULT_CENTER,
      projection: 'globe',
    });

    mapRef.current = map;

    const handleInteractionStart = () => {
      userInteractingRef.current = true;
    };

    const handleInteractionEnd = () => {
      userInteractingRef.current = false;
      spinGlobe();
    };

    map.on('style.load', () => {
      map.setFog({});
      spinGlobe();
    });

    map.on('mousedown', handleInteractionStart);
    map.on('touchstart', handleInteractionStart);
    map.on('mouseup', handleInteractionEnd);
    map.on('touchend', handleInteractionEnd);
    map.on('dragend', handleInteractionEnd);
    map.on('pitchend', handleInteractionEnd);
    map.on('rotateend', handleInteractionEnd);
    map.on('moveend', spinGlobe);

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
      userInteractingRef.current = false;
    };
  }, [hasValidToken, spinGlobe]);

  useEffect(() => {
    isSpinningRef.current = isSpinning;

    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (!isSpinning) {
      map.stop();
    } else if (map.isStyleLoaded()) {
      spinGlobe();
    }
  }, [isSpinning, spinGlobe]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (!antipode) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    if (!markerRef.current) {
      markerRef.current = new mapboxgl.Marker({ color: '#e76f51' });
    }

    markerRef.current
      .setLngLat([antipode.longitude, antipode.latitude])
      .addTo(map);

    const targetZoom = Math.max(map.getZoom(), 2.5);
    const animateToAntipode = () => {
      map.easeTo({
        center: [antipode.longitude, antipode.latitude],
        zoom: targetZoom,
        duration: 1500,
        easing: (n) => n,
        essential: true,
      });
    };

    if (map.isStyleLoaded()) {
      animateToAntipode();
    } else {
      map.once('styledata', animateToAntipode);
    }
  }, [antipode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    map.resize();
  }, [layoutKey]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '1rem',
          overflow: 'hidden',
        }}
      />
      {!hasValidToken ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '1.5rem',
            fontWeight: 600,
            color: '#f8fafc',
            background:
              'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.85))',
            pointerEvents: 'none',
          }}
        >
          Add your Mapbox access token in
          {' '}
          <code style={{ fontWeight: 700 }}>
            frontend/src/config/mapbox.ts
          </code>
          {' '}
          or set
          {' '}
          <code style={{ fontWeight: 700 }}>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code>
          {' '}
          to view the globe.
        </div>
      ) : null}
    </div>
  );
}
