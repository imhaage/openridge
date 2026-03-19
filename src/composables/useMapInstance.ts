import type { Map } from '@maptiler/sdk';
import { shallowRef } from 'vue';

const map = shallowRef<Map | null>(null);

export function useMapInstance() {
  return { map };
}
