<script setup lang="ts">
import maplibregl, { type GeoJSONSourceSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { onMounted, ref, watch } from 'vue';

const trackGeoJSON = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [
            [2.041982959276595, 42.50685521262122],
            [2.041927432750299, 42.50716219691566],
            [2.0420516022407753, 42.5073495876982],
            [2.0422919044074206, 42.50755514878199],
            [2.0425522398293197, 42.50784197173698],
            [2.042170803032974, 42.50821691411272],
            [2.0425008340393447, 42.50860094331463],
            [2.042135772965622, 42.50879540246464],
            [2.0415466846073684, 42.50888982409177],
            [2.0411788874312435, 42.509607851086514],
            [2.0420640560978995, 42.50988630080613],
            [2.0422392319581206, 42.51072427785766],
            [2.0414071664787627, 42.51081759668185],
            [2.0401906060706096, 42.511358811630345],
            [2.0394101447342905, 42.51165806192407],
            [2.0388809022433634, 42.51305597937258],
            [2.037590785638969, 42.51311311412712],
            [2.03677300983162, 42.51445794043036],
            [2.035011942357926, 42.514948600413334],
            [2.033825510563787, 42.516186903480104],
            [2.0349015672559005, 42.5166058609297],
            [2.0362554229481873, 42.51664072404125],
          ],
          type: 'LineString',
        },
      },
    ],
  },
};

const isSatelliteBasemap = ref(true);

const api_key = import.meta.env.VITE_MAPTILER_API_KEY;

onMounted(() => {
  const map = new maplibregl.Map({
    container: 'map', // container id
    center: [2.04, 42.51], // starting position [lng, lat]
    zoom: 15, // starting zoom
    pitch: 50,
    maplibreLogo: true,
    style: `https://api.maptiler.com/maps/019cdf8f-4103-7c1d-b40f-ee87f04dc387/style.json?key=${api_key}`,
  });

  map.on('load', () => {
    map.addSource('track', trackGeoJSON as GeoJSONSourceSpecification);
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
  });

  watch(isSatelliteBasemap, () => {
    map.setStyle(
      isSatelliteBasemap.value
        ? `https://api.maptiler.com/maps/019cdf8f-4103-7c1d-b40f-ee87f04dc387/style.json?key=${api_key}`
        : `https://api.maptiler.com/maps/019cddde-adc5-7944-8477-680ab3315819/style.json?key=${api_key}`,
    );

    map.once('style.load', () => {
      map.addSource('track', trackGeoJSON as GeoJSONSourceSpecification);
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
    });
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
