# Why fitBounds breaks with a pitched map (and how to fix it)

*(written with the assistance of Claude Code)*

## What is pitch?

When you create a MapLibre map, you can tilt it toward you using the `pitch` option.
A pitch of `0` means you are looking straight down at the map, like a satellite image.
A pitch of `60` means the camera is tilted 60 degrees — you see the map at an angle,
like looking at a table from across the room.

```js
const map = new maplibregl.Map({
  pitch: 60, // tilted camera
  ...
});
```

---

## What is fitBounds?

`map.fitBounds(bounds)` is MapLibre's way of saying:
**"Move the camera so that this rectangular area is fully visible on screen."**

You give it two corners of a rectangle (south-west and north-east), and MapLibre
figures out the right zoom level and center to show everything inside.

```js
map.fitBounds(
  [[minLng, minLat], [maxLng, maxLat]],
  { padding: 50 }
);
```

---

## The problem

`fitBounds` was designed for a **flat, top-down view** (pitch = 0).

It works like this internally:
1. Take the bounding box of your data.
2. Find the geographic center of that box.
3. Place that center at the **center of the screen**.
4. Pick a zoom level so everything fits.

This works perfectly when pitch = 0, because the center of the screen corresponds
exactly to the center of what you are looking at on the ground.

**But with pitch = 60, something goes wrong.**

When the camera is tilted, perspective distortion kicks in:

- The **bottom of the screen** shows terrain that is very close to you.
  It takes up a lot of screen space for a small geographic area.
- The **top of the screen** shows terrain that is far away.
  It takes up very little screen space for a large geographic area.

So when MapLibre places the geographic center of your data at the center of the screen,
the perspective makes everything look like it is sliding toward the bottom.
The far (top) edge of your data disappears near the horizon,
and the near (bottom) edge fills the lower half of the screen.

**Result: your data appears squashed at the bottom of the screen.**

---

## The solution: offset

MapLibre's `fitBounds` accepts an `offset` option:

```
offset: [x, y]
```

This tells MapLibre: **"place the center of the bounds X pixels to the right and Y pixels
down from the center of the screen."**

A **negative Y** value moves the bounds center **up** on the screen.
This pushes the data downward — away from the horizon — so it becomes
more evenly distributed in the visible area.

The amount of compensation we need depends on:
- **How tall the bounds are on screen** (in pixels): more height = more correction needed.
- **How steep the pitch is**: a steeper pitch creates more distortion, so we need more offset.

The formula is:

```
offset Y = -(boundsHeightPx / 2) * Math.sin(pitchRad)
```

---

## Why not use the container height?

You might think: "just use half the screen height as the scale factor."

```
offset Y = -(screenHeight / 2) * Math.sin(pitchRad)  ← tempting but wrong
```

This works when the data is tall enough to fill the screen vertically — for example,
a long N-S track in a big city.

But if your data is **wider than it is tall** (an E-W mountain trail, a ski run along
a ridge), `fitBounds` picks a zoom level based on the **width** of the bounds, not
the height. The bounds height in pixels ends up being much smaller than the screen height.
Using the full screen height as the scale factor over-corrects: the data flies above
the visible area.

The safe approach is to always use the **actual bounds height in pixels**,
which you can compute from the zoom that `cameraForBounds` gives you.

---

## Two-pass approach

`fitBounds` doesn't tell you what zoom it picked. So we do it in two steps:

1. Ask MapLibre: *"what zoom would you use for this data?"* → `cameraForBounds`
2. Use that zoom to convert the latitude extent into pixels → `boundsHeightPx`
3. Then call `fitBounds` with the correctly scaled offset

### Converting latitude to pixels (Mercator)

MapLibre uses the **Mercator projection**. In Mercator, latitude is not linear —
higher latitudes get stretched. The formula to convert a latitude to a Mercator
y-coordinate is:

```
y = ln( tan(π/4 + lat/2) )
```

The difference between two latitudes in Mercator units, multiplied by the world
pixel width at a given zoom, gives the bounds height in pixels:

```
boundsHeightPx = (toMerc(maxLat) - toMerc(minLat)) * (2^zoom * 512) / (2π)
```

`2^zoom * 512` is the total width (and height) of the Mercator world in pixels at
that zoom level. MapLibre uses 512-pixel tiles by default.

---

## The final code

```typescript
const [minLng, minLat, maxLng, maxLat] = bbox(geojsonData);
const bounds: maplibregl.LngLatBoundsLike = [[minLng, minLat], [maxLng, maxLat]];

// Step 1: ask MapLibre what zoom it would use (at pitch = 0, flat calculation)
const camera = map.cameraForBounds(bounds, { padding: 50 });
if (!camera) return;

// Step 2: convert the latitude extent to pixels at that zoom
const pitchRad = (map.getPitch() * Math.PI) / 180;
const zoom = camera.zoom!;
const toMerc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const boundsHeightPx = (toMerc(maxLat) - toMerc(minLat)) * (Math.pow(2, zoom) * 512) / (2 * Math.PI);

// Step 3: fit with the correct pitch-aware offset
map.fitBounds(bounds, {
  padding: 50,
  offset: [0, -(boundsHeightPx / 2) * Math.sin(pitchRad)],
});
```

**Step by step:**
1. `bbox(...)` gives us the bounding box of the GeoJSON data.
2. `cameraForBounds` computes what zoom MapLibre would pick to fit the data — without actually moving the camera.
3. `toMerc` converts a latitude to a Mercator y-coordinate, accounting for the projection's stretching at higher latitudes.
4. `boundsHeightPx` is the height of the bounding box in screen pixels at that zoom.
5. `-(boundsHeightPx / 2) * Math.sin(pitchRad)` is the vertical correction: negative to go upward, scaled by the actual bounds height (not the screen height) and the pitch steepness.
6. `fitBounds` uses this offset to place the data correctly regardless of the track's orientation or size.

`Math.sin(pitchRad)` gives a value between 0 and 1 that scales with the pitch:
- pitch = 0°  → sin(0) = 0    → no offset needed
- pitch = 30° → sin(30°) = 0.5  → medium offset
- pitch = 60° → sin(60°) ≈ 0.87 → large offset
- pitch = 90° → sin(90°) = 1    → maximum offset
