const MAP_STATE_KEY = 'openridge:mapState';

type MapState = { center: [number, number]; zoom: number; pitch: number; bearing: number };

export function useMapState() {
  function load(): MapState | null {
    try {
      const raw = localStorage.getItem(MAP_STATE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function save(state: MapState) {
    localStorage.setItem(MAP_STATE_KEY, JSON.stringify(state));
  }

  return { load, save };
}
