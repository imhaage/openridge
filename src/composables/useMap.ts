import bbox from '@turf/bbox';
import { square } from '@turf/square';
import {
  Map as MaptilerMap,
  MapStyle,
  config,
  type GeoJSONSourceSpecification,
  GeoJSONSource,
} from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { onMounted, watch, type ShallowRef } from 'vue';
import { useMapInstance } from './useMapInstance';
import { useMapState } from './useMapState';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'carte-facile/carte-facile.css';

function renderTrack(map: MaptilerMap, data: GeoJSONSourceSpecification) {
  const trackSource = map.getSource('track');

  if (trackSource) {
    (trackSource as GeoJSONSource).setData(data.data as GeoJSON.GeoJSON);
  } else {
    map.addSource('track', data);

    map.addLayer(
      {
        id: 'track',
        type: 'line',
        source: 'track',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#6baed6', 'line-width': 4 },
      },
      '',
    );

    map.addLayer(
      {
        id: 'track-points',
        type: 'circle',
        source: 'track',
        paint: { 'circle-color': '#3182bd', 'circle-radius': 4 },
      },
      '',
    );
  }
}

const { load: loadMapState, save: saveMapState } = useMapState();

export function useMap(containerId: string, geojsonData: ShallowRef<GeoJSONSourceSpecification>) {
  const { map } = useMapInstance();

  function toggle3DView() {
    if (map.value) {
      map.value.easeTo(map.value.getPitch() !== 0 ? { pitch: 0, bearing: 0 } : { pitch: 60 });
    }
  }

  onMounted(() => {
    const savedState = loadMapState();

    config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
    const mapInstance = new MaptilerMap({
      container: containerId,
      center: savedState?.center ?? [2.5, 46.5],
      zoom: savedState?.zoom ?? 5,
      pitch: savedState?.pitch ?? 0,
      bearing: savedState?.bearing ?? 0,
      maptilerLogo: true,
      style: MapStyle.HYBRID_V4,
      terrain: true,
      navigationControl: false,
    });

    map.value = mapInstance;

    mapInstance.on('moveend', () => {
      const { lng, lat } = mapInstance.getCenter();
      saveMapState({
        center: [lng, lat],
        zoom: mapInstance.getZoom(),
        pitch: mapInstance.getPitch(),
        bearing: mapInstance.getBearing(),
      });
    });

    watch(geojsonData, () => {
      renderTrack(mapInstance, geojsonData.value);

      const [west, south, east, north] = square(bbox(geojsonData.value.data as GeoJSON.GeoJSON));

      // Add padding if bbox is too small to avoid zooming in too much (weird fitBounds bug)
      const paddingLon = east - west < 0.01 ? 0.01 : 0;
      const paddingLat = north - south < 0.01 ? 0.01 : 0;

      mapInstance.fitBounds(
        [
          [west - paddingLon, south - paddingLat],
          [east + paddingLon, north + paddingLat],
        ],
        { padding: 50, pitch: 0, bearing: 0, duration: 2000 },
      );
    });
  });

  return { toggle3DView };
}
