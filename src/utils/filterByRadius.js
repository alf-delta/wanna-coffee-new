import { distance } from '@turf/turf';

/**
 * Filters coffee shops by radius from a given center.
 *
 * @param {Array} shops - List of coffee shops with coordinates [{ name, latitude, longitude }, ...]
 * @param {Object} center - Map center { lat, lng }
 * @param {number} radius - Radius in meters
 * @returns {Array} - Filtered list of coffee shops
 */
export function filterByRadius(shops, center, radius) {
  return shops.filter(shop => {
    const shopPoint = [shop.longitude, shop.latitude];
    const centerPoint = [center.lng, center.lat];

    const dist = distance(centerPoint, shopPoint, { units: 'meters' });

    return dist <= radius;
  });
}