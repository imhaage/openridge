<script setup lang="ts">
import { useGeoJsonFile } from '../composables/useGeoJsonFile';
import { useMap } from '../composables/useMap';
import OpenRidgeLogo from './OpenRidgeLogo.vue';
import MapControl from './MapControl.vue';

const { geojsonData, fileInput, onFileChange } = useGeoJsonFile();

useMap('map', geojsonData);
</script>

<template>
  <div class="container">
    <div class="header">
      <OpenRidgeLogo />

      <button class="button" @click="fileInput?.click()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M6 20q-.825 0-1.412-.587T4 18v-2q0-.425.288-.712T5 15t.713.288T6 16v2h12v-2q0-.425.288-.712T19 15t.713.288T20 16v2q0 .825-.587 1.413T18 20zm5-12.15L9.125 9.725q-.3.3-.712.288T7.7 9.7q-.275-.3-.288-.7t.288-.7l3.6-3.6q.15-.15.325-.212T12 4.425t.375.063t.325.212l3.6 3.6q.3.3.288.7t-.288.7q-.3.3-.712.313t-.713-.288L13 7.85V15q0 .425-.288.713T12 16t-.712-.288T11 15z"
          />
        </svg>
        <span>Upload GeoJSON</span>
      </button>

      <input
        ref="fileInput"
        type="file"
        accept=".geojson,application/geo+json"
        class="hidden"
        @change="onFileChange"
      />
    </div>

    <div id="map" class="map"><MapControl /></div>
  </div>
</template>

<style>
.container {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100svh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  width: 100%;
  color: #fff;
  background-color: #2b2b2c;
  z-index: 1;
}

.map {
  position: relative;
}

.hidden {
  display: none;
}
</style>
