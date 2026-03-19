<script setup lang="ts">
import { useMapInstance } from '../composables/useMapInstance';

const { map } = useMapInstance();

function zoomIn() {
  map.value?.zoomIn();
}

function zoomOut() {
  map.value?.zoomOut();
}

function toggle3D() {
  map.value?.easeTo(map.value.getPitch() !== 0 ? { pitch: 0, bearing: 0 } : { pitch: 60 });
}
</script>

<template>
  <div class="map-control">
    <button class="button" @click="zoomIn" title="Zoom in">+</button>
    <button class="button" @click="zoomOut" title="Zoom out">-</button>
    <button class="button" @click="toggle3D" title="Toggle 2D/3D view">
      <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M8 14.25L4.75 11H7c.25-5.61 2.39-10 5-10c2 0 3.77 2.64 4.55 6.45C20.36 8.23 23 10 23 12c0 1.83-2.17 3.43-5.4 4.3l.29-2.03C19.8 13.72 21 12.91 21 12c0-1.06-1.65-2-4.13-2.5c.08.79.13 1.63.13 2.5c0 6.08-2.24 11-5 11c-1.83 0-3.43-2.17-4.3-5.4l2.03.29C10.28 19.8 11.09 21 12 21c1.66 0 3-4.03 3-9q0-1.5-.15-2.85Q13.5 9 12 9l-1.86.06l.29-2.01L12 7c.87 0 1.71.05 2.5.13C14 4.65 13.06 3 12 3c-1.54 0-2.82 3.5-3 8h2.25zM14.25 16L11 19.25V17c-5.61-.25-10-2.39-10-5c0-1.83 2.17-3.43 5.4-4.3l-.29 2.03C4.2 10.28 3 11.09 3 12c0 1.54 3.5 2.82 8 3v-2.25z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.map-control {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  z-index: 100;

  & button {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 0;
  }

  & button:first-of-type {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    border-bottom: 1px solid var(--color-bg-light);
  }

  & button:last-of-type {
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    border-top: 1px solid var(--color-bg-light);
  }
}
</style>
