import bbox from '@turf/bbox';
import { square } from '@turf/square';

import maplibregl, { type GeoJSONSourceSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { onMounted, ref, watch, type ShallowRef } from 'vue';

const api_key = import.meta.env.VITE_MAPTILER_API_KEY;

const STYLES = {
  satellite: `https://api.maptiler.com/maps/019cebbf-159e-74bd-9c38-be3a13abd444/style.json?key=${api_key}`,
  topo: `https://api.maptiler.com/maps/019cebbf-cd46-7d9d-8b0a-13739b70f21a/style.json?key=${api_key}`,
};

function renderTrack(map: maplibregl.Map, data: GeoJSONSourceSpecification) {
  const trackSource = map.getSource('track');

  if (trackSource) {
    (trackSource as maplibregl.GeoJSONSource).setData(data.data as GeoJSON.GeoJSON);
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

export function useMap(containerId: string, geojsonData: ShallowRef<GeoJSONSourceSpecification>) {
  let map: maplibregl.Map;

  const pitch = ref(0);
  const isSatelliteBasemap = ref(true);

  function togglePitch() {
    map?.easeTo({ pitch: pitch.value === 0 ? 60 : 0 });
  }

  onMounted(() => {
    map = new maplibregl.Map({
      container: containerId,
      center: [2.04, 42.51],
      zoom: 15,
      pitch: 0,
      maplibreLogo: true,
      style: STYLES.satellite,
    });

    map.on('pitch', () => {
      pitch.value = map.getPitch();
    });

    watch(geojsonData, () => {
      renderTrack(map, geojsonData.value);

      const [west, south, east, north] = square(bbox(geojsonData.value.data as GeoJSON.GeoJSON));

      // Add padding if bbox is too small to avoid zooming in too much (weird fitBounds bug)
      const paddingLon = east - west < 0.01 ? 0.01 : 0;
      const paddingLat = north - south < 0.01 ? 0.01 : 0;

      map.fitBounds(
        [
          [west - paddingLon, south - paddingLat],
          [east + paddingLon, north + paddingLat],
        ],
        { padding: 50, pitch: 0, bearing: 0, duration: 2000 },
      );
    });

    watch(isSatelliteBasemap, () => {
      map.once('style.load', () => renderTrack(map, geojsonData.value));
      map.setStyle(isSatelliteBasemap.value ? STYLES.satellite : STYLES.topo);
    });
  });

  return { pitch, isSatelliteBasemap, togglePitch };
}
