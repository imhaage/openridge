<script setup lang="ts">
import { useGeoJsonFile } from '../composables/useGeoJsonFile';
import { useMap } from '../composables/useMap';

const { geojsonData, fileInput, onFileChange } = useGeoJsonFile();
const { isSatelliteBasemap, togglePitch } = useMap('map', geojsonData);
</script>

<template>
  <div class="container">
    <div class="header">
      <button @click="isSatelliteBasemap = !isSatelliteBasemap">Toggle basemap</button>
      <button @click="fileInput?.click()">Upload GeoJSON</button>
      <button @click="togglePitch">Toggle pitch</button>

      <input
        ref="fileInput"
        type="file"
        accept=".geojson,application/geo+json"
        class="hidden"
        @change="onFileChange"
      />
    </div>

    <div id="map" class="map"></div>
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: #345;
}

.container {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100svh;
}

.header {
  padding: 4px;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #789;
  z-index: 1;
}

.hidden {
  display: none;
}
</style>
