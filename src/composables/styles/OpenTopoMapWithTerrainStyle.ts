export const OpenTopoMapWithTerrainStyle: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    openTopoMap: {
      type: 'raster',
      tiles: ['https://a.tile.opentopomap.org/{z}/{x}/{y}.png'],
      attribution: "&copy; <a href='https://opentopomap.org'>OpenTopoMap</a>",
    },
    terrainSource: {
      type: 'raster-dem',
      url: 'https://tiles.mapterhorn.com/tilejson.json',
    },
  },
  terrain: {
    source: 'terrainSource',
    exaggeration: 1.2,
  },
  layers: [
    {
      id: 'opentopomap',
      type: 'raster',
      source: 'openTopoMap',
    },
  ],
};
