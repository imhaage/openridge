<script setup lang="ts">
import { useGeoJsonFile } from '../composables/useGeoJsonFile';
import { useMap } from '../composables/useMap';
import OpenRidgeLogo from './OpenRidgeLogo.vue';

const { geojsonData, fileInput, onFileChange } = useGeoJsonFile();
const { togglePitch } = useMap('map', geojsonData);
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <OpenRidgeLogo />
        <button @click="fileInput?.click()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M6 20q-.825 0-1.412-.587T4 18v-2q0-.425.288-.712T5 15t.713.288T6 16v2h12v-2q0-.425.288-.712T19 15t.713.288T20 16v2q0 .825-.587 1.413T18 20zm5-12.15L9.125 9.725q-.3.3-.712.288T7.7 9.7q-.275-.3-.288-.7t.288-.7l3.6-3.6q.15-.15.325-.212T12 4.425t.375.063t.325.212l3.6 3.6q.3.3.288.7t-.288.7q-.3.3-.712.313t-.713-.288L13 7.85V15q0 .425-.288.713T12 16t-.712-.288T11 15z"
            />
          </svg>
          <span>Upload GeoJSON</span>
        </button>
      </div>

      <div>
        <button @click="togglePitch">
          <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M8 14.25L4.75 11H7c.25-5.61 2.39-10 5-10c2 0 3.77 2.64 4.55 6.45C20.36 8.23 23 10 23 12c0 1.83-2.17 3.43-5.4 4.3l.29-2.03C19.8 13.72 21 12.91 21 12c0-1.06-1.65-2-4.13-2.5c.08.79.13 1.63.13 2.5c0 6.08-2.24 11-5 11c-1.83 0-3.43-2.17-4.3-5.4l2.03.29C10.28 19.8 11.09 21 12 21c1.66 0 3-4.03 3-9q0-1.5-.15-2.85Q13.5 9 12 9l-1.86.06l.29-2.01L12 7c.87 0 1.71.05 2.5.13C14 4.65 13.06 3 12 3c-1.54 0-2.82 3.5-3 8h2.25zM14.25 16L11 19.25V17c-5.61-.25-10-2.39-10-5c0-1.83 2.17-3.43 5.4-4.3l-.29 2.03C4.2 10.28 3 11.09 3 12c0 1.54 3.5 2.82 8 3v-2.25z"
            />
          </svg>
          <span>2D/3D</span>
        </button>
      </div>

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
.container {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100svh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 4px;
  width: 100%;
  color: #fff;
  background-color: #2b2b2c;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hidden {
  display: none;
}
</style>
