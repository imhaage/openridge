import bbox from '@turf/bbox';
import { square } from '@turf/square';
import maplibregl, { type GeoJSONSourceSpecification } from 'maplibre-gl';
import { onMounted, ref, watch, type ShallowRef } from 'vue';
import 'maplibre-gl/dist/maplibre-gl.css';

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

  const currentPitch = ref(0);
  const currentBearing = ref(0);

  function togglePitch() {
    map?.easeTo(
      currentPitch.value !== 0 || currentBearing.value !== 0
        ? { pitch: 0, bearing: 0 }
        : { pitch: 60, bearing: 0 },
    );
  }

  onMounted(() => {
    map = new maplibregl.Map({
      container: containerId,
      center: [2.04, 42.51],
      zoom: 15,
      pitch: 0,
      maplibreLogo: true,
      style: {
        version: 8,
        sources: {
          openTopoMap: {
            type: 'raster',
            tiles: ['https://a.tile.opentopomap.org/{z}/{x}/{y}.png'],
            attribution: "&copy; <a href='https://opentopomap.org'>OpenTopoMap</a>",
          },
          terrainSource: {
            type: 'raster-dem',
            url: 'https://tiles.mapterhorn.com/tilejson.json',
          },
        },
        terrain: {
          source: 'terrainSource',
          exaggeration: 1,
        },
        layers: [
          {
            id: 'opentopomap',
            type: 'raster',
            source: 'openTopoMap',
          },
        ],
      } as maplibregl.StyleSpecification,
    });

    map.on('pitch', () => {
      currentPitch.value = map.getPitch();
    });

    map.on('bearing', () => {
      currentBearing.value = map.getBearing();
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
  });

  return { pitch: currentPitch, togglePitch };
}
