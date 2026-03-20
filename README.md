# OpenRidge

Visualize past hikes and prepare for future ones.

https://openridge.netlify.app

## Stack

- [Vue.js](https://vuejs.org/)
- [MapTiler SDK (MapLibre)](https://maplibre.org/projects/gl-js/)
- [deck.gl](https://deck.gl/)

👨‍🎓 After working with React for 8 years and deck.gl/react-map-gl for 5 years, this project is an opportunity to discover how to work with Vue.js and deck.gl/maplibre.

## Features

Short term (currently being built):
- [x] Basemaps : MapTiler, using MapTiler SDK so that map loads are billed as sessions rather than individual tile requests (which would consume credits much faster with MapLibre GL JS directly)
- [x] Load and visualize GeoJSON data (points and lines)
- [ ] Visualize hiking trail around a location
- [ ] Load and visualize GPX data
- [ ] Show information when hovering over a point along the route, depending on the available data
- [ ] Allow users to custormize the route style (colors, line-width, etc.)
- [ ] Weather forecasts along the route using open-meteo.com API

Mid term:
- Mobile network coverage (France only for now, ARCEP data)
- Show useful POIs from OpenStreetMap: shelters, water sources, parking, etc.

Long term:
- Estimated walking time
- Support for other formats (Shapefile, KML/KMZ, etc.)
- Create routes in app