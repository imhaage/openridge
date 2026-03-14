import { ref, shallowRef } from 'vue';
import type { GeoJSONSourceSpecification } from 'maplibre-gl';

export function useGeoJsonFile() {
  const geojsonData = shallowRef<GeoJSONSourceSpecification>({
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  });

  const fileInput = ref<HTMLInputElement | null>(null);

  function onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        geojsonData.value = {
          type: 'geojson',
          data: JSON.parse(reader.result as string),
        };
      } catch {
        alert('Invalid JSON');
      }
    };
    reader.readAsText(file);
  }

  return { geojsonData, fileInput, onFileChange };
}
