import * as turf from '@turf/turf';

export function getCircleBounds(center, radiusMeters) {
  // center: [lng, lat]
  const circle = turf.circle(center, radiusMeters / 1000, { steps: 64, units: 'kilometers' });
  const bbox = turf.bbox(circle); // [minX, minY, maxX, maxY]
  return [
    [bbox[0], bbox[1]], // southwest
    [bbox[2], bbox[3]], // northeast
  ];
}

// Calculates mapbox zoom to fit a circle of radiusMeters into the viewport with padding
export function getZoomForRadius({ radiusMeters, mapWidthPx, mapHeightPx, paddingPx = 40, latitude }) {
  // Circle diameter in meters
  const diameter = radiusMeters * 2;
  // Viewport dimensions considering padding
  const w = mapWidthPx - 2 * paddingPx;
  const h = mapHeightPx - 2 * paddingPx;
  // Use the smaller dimension
  const displayMeters = Math.min(w, h);
  // 40075016.686 - length of the equator in meters
  // 256 - tile size
  // cos(latitude) - latitude correction
  // Mapbox formula: zoom = log2( (mapWidthPx * 156543.03392 * cos(lat)) / (diameter * 256) )
  const metersPerPixel = diameter / displayMeters;
  const zoom = Math.log2((156543.03392 * Math.cos(latitude * Math.PI / 180)) / metersPerPixel);
  return zoom;
} 