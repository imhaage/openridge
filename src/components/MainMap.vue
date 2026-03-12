<script setup lang="ts">
import bbox from '@turf/bbox';
import maplibregl, { type GeoJSONSourceSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { computed, onMounted, ref, shallowRef, watch } from 'vue';

const isSatelliteBasemap = ref(true);

const geojsonData = shallowRef<GeoJSONSourceSpecification>({
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [],
  },
});

const fileInput = ref<HTMLInputElement | null>(null);

const api_key = import.meta.env.VITE_MAPTILER_API_KEY;

function renderTrack(map: maplibregl.Map, data: GeoJSONSourceSpecification) {
  const trackSource = map.getSource('track');

  if (trackSource) {
    const source = trackSource as maplibregl.GeoJSONSource;
    source.setData(data.data as GeoJSON.GeoJSON);
  } else {
    map.addSource('track', data);
    map.addLayer(
      {
        id: 'track',
        type: 'line',
        source: 'track',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#f88',
          'line-width': 4,
        },
      },
      '',
    );
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      geojsonData.value = {
        type: 'geojson',
        data: JSON.parse(reader.result as string),
      };

      console.log('Loaded GeoJSON:', geojsonData.value);
    } catch {
      alert('Invalid JSON');
    }
  };
  reader.readAsText(file);
}

onMounted(() => {
  const pitch = ref(0);
  const elevation = computed(() => pitch.value === 0 ? 0 : 1);

  const map = new maplibregl.Map({
    container: 'map',
    center: [2.04, 42.51],
    zoom: 15,
    pitch: 0,
    maplibreLogo: true,
    style: `https://api.maptiler.com/maps/019cdf8f-4103-7c1d-b40f-ee87f04dc387/style.json?key=${api_key}`,
  });

  map.on('pitch', () => { pitch.value = map.getPitch(); });

  watch(elevation, (newElevation) => {
    map.setTerrain(map.getTerrain() ? { ...map.getTerrain()!, exaggeration: newElevation } : null);
  });

  watch(geojsonData, () => {
    renderTrack(map, geojsonData.value);

    const [minLng, minLat, maxLng, maxLat] = bbox(geojsonData.value.data as GeoJSON.GeoJSON);

    map.fitBounds([minLng, minLat, maxLng, maxLat], { padding: 50, pitch: 0 });
  });

  watch(isSatelliteBasemap, () => {
    map.once('style.load', () => {
      renderTrack(map, geojsonData.value);
    });

    map.setStyle(
      isSatelliteBasemap.value
        ? `https://api.maptiler.com/maps/019cdf8f-4103-7c1d-b40f-ee87f04dc387/style.json?key=${api_key}`
        : `https://api.maptiler.com/maps/019cddde-adc5-7944-8477-680ab3315819/style.json?key=${api_key}`,
    );
  });
});
</script>

<template>
  <div style="position: fixed; top: 10px; left: 10px; z-index: 1">
    <button @click="isSatelliteBasemap = !isSatelliteBasemap">Toggle basemap</button>

    <button @click="fileInput?.click()">Upload GeoJSON</button>
    <input
      ref="fileInput"
      type="file"
      accept=".geojson,application/geo+json"
      class="hidden"
      @change="onFileChange"
    />
  </div>

  <div id="map" style="width: 100vw; height: 100vh">Test</div>
</template>

<style>
body {
  margin: 0;
  background-color: #345;
}

.hidden {
  display: none;
}
</style>
