import { shallowRef } from 'vue';
import type maplibregl from 'maplibre-gl';

const map = shallowRef<maplibregl.Map | null>(null);

export function useMapInstance() {
  return { map };
}
