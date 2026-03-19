# OpenRidge

Visualize past hikes and prepare for future ones.

https://openridge.netlify.app

## Stack

- [Vue.js](https://vuejs.org/)
- [MapLibre](https://maplibre.org/projects/gl-js/)

👨‍🎓 After working with React for 8 years and deck.gl/react-map-gl for 5 years, this project is an opportunity to discover how to work with Vue.js and maplibre.

## Features

Short term (currently being built):
- [x] Basemap : IGN Aerial photography + 3D rendering of the elevation using Mapterhorn data ([coverage](https://mapterhorn.com/coverage/#map=0.9/0/0))
- [ ] Visualize long-distance hiking trail in France ([GRs](https://data.smartidf.services/explore/dataset/grs-de-france/information/?location=12,48.31793,0.21217&basemap=ign.planv2))
- [x] Load and visualize GeoJSON data (points and lines)
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