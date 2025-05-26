

import { distance } from '@turf/turf';

/**
 * Фильтрует кофейни по радиусу от заданного центра.
 *
 * @param {Array} shops - Список кофеен с координатами [{ name, latitude, longitude }, ...]
 * @param {Object} center - Центр карты { lat, lng }
 * @param {number} radius - Радиус в метрах
 * @returns {Array} - Отфильтрованный список кофеен
 */
export function filterByRadius(shops, center, radius) {
  return shops.filter(shop => {
    const shopPoint = [shop.longitude, shop.latitude];
    const centerPoint = [center.lng, center.lat];

    const dist = distance(centerPoint, shopPoint, { units: 'meters' });

    return dist <= radius;
  });
}