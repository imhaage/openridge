<script setup lang="ts">
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { onMounted, ref, watch } from 'vue';
import { geojsonSample as data } from '../data/geojson_sample';

const isSatelliteBasemap = ref(true);

const api_key = import.meta.env.VITE_MAPTILER_API_KEY;

function renderTrack(map: maplibregl.Map) {
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

onMounted(() => {
  const map = new maplibregl.Map({
    container: 'map',
    center: [2.04, 42.51],
    zoom: 15,
    pitch: 60,
    maplibreLogo: true,
    style: `https://api.maptiler.com/maps/019cdf8f-4103-7c1d-b40f-ee87f04dc387/style.json?key=${api_key}`,
  });

  map.on('load', () => {
    renderTrack(map);
  });

  watch(isSatelliteBasemap, () => {
    map.once('style.load', () => {
      renderTrack(map);
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
  </div>
  <div id="map" style="width: 100vw; height: 100vh">Test</div>
</template>

<style>
body {
  margin: 0;
  background-color: #345;
}
</style>
