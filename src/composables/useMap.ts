import bbox from '@turf/bbox';
import { square } from '@turf/square';
import maplibregl, {
  type GeoJSONSourceSpecification,
  type SymbolLayerSpecification,
} from 'maplibre-gl';
import { onMounted, ref, watch, type ShallowRef } from 'vue';
import { mapStyles, addOverlay, Overlay } from 'carte-facile';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'carte-facile/carte-facile.css';
import { IgnAerial } from './styles/IgnAerial';
import { useMapState } from './useMapState';

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

const { load: loadMapState, save: saveMapState } = useMapState();

export function useMap(containerId: string, geojsonData: ShallowRef<GeoJSONSourceSpecification>) {
  let map: maplibregl.Map;

  const currentPitch = ref(0);

  function toggle3DView() {
    if (map) {
      map.easeTo(currentPitch.value !== 0 ? { pitch: 0, bearing: 0 } : { pitch: 60 });
    }
  }

  onMounted(() => {
    const savedState = loadMapState();

    map = new maplibregl.Map({
      container: containerId,
      center: savedState?.center ?? [2.5, 46.5],
      zoom: savedState?.zoom ?? 5,
      pitch: savedState?.pitch ?? 0,
      bearing: savedState?.bearing ?? 0,
      maplibreLogo: true,
      style: IgnAerial,
    });

    map.on('load', () => {
      addOverlay(map, [Overlay.levelCurves]);

      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;

      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i] as SymbolLayerSpecification;
        if (layer.type === 'symbol' && layer.layout?.['text-field']) {
          labelLayerId = layer.id;
          break;
        }
      }

      map.addSource('openfreemap', {
        url: `https://tiles.openfreemap.org/planet`,
        type: 'vector',
        attribution: 'OpenFreemap',
      });

      map.addLayer(
        {
          id: '3d-buildings',
          source: 'openfreemap',
          'source-layer': 'building',
          type: 'fill-extrusion',
          minzoom: 15,
          filter: ['!=', ['get', 'hide_3d'], true],
          paint: {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'render_height'],
              0,
              '#f5dda6',
              200,
              '#fab984',
              400,
              '#fa7d7d',
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              16,
              ['get', 'render_height'],
            ],
            'fill-extrusion-base': [
              'case',
              ['>=', ['get', 'zoom'], 16],
              ['get', 'render_min_height'],
              0,
            ],
          },
        },
        labelLayerId,
      );
    });

    console.log('Map initialized', mapStyles.aerial);

    map.addControl(new maplibregl.NavigationControl());

    map.on('moveend', () => {
      const { lng, lat } = map.getCenter();
      saveMapState({ center: [lng, lat], zoom: map.getZoom(), pitch: map.getPitch(), bearing: map.getBearing() });
    });

    map.on('pitch', () => {
      currentPitch.value = map.getPitch();
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

  return { toggle3DView };
}
