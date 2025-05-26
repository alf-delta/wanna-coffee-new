import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '../assets/mapbox-token';
import * as turf from '@turf/turf';

mapboxgl.accessToken = MAPBOX_TOKEN;

const CoffeeMap = ({ coffeeShops = [], radius = 1000, onCenterChange }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  const initialCenter = [-74.006, 40.7128]; // Нью-Йорк, Манхэттен

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: 13,
    });

    const centerDot = document.createElement('div');
    centerDot.style.position = 'absolute';
    centerDot.style.width = '12px';
    centerDot.style.height = '12px';
    centerDot.style.backgroundColor = 'red';
    centerDot.style.borderRadius = '50%';
    centerDot.style.left = '50%';
    centerDot.style.top = '50%';
    centerDot.style.transform = 'translate(-50%, -50%)';
    centerDot.style.zIndex = '10';
    mapContainer.current.appendChild(centerDot);

    map.current.on('load', () => {
      map.current.addSource('radius', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: map.current.getCenter().toArray(),
          },
        },
      });

      map.current.addLayer({
        id: 'radius-circle',
        type: 'circle',
        source: 'radius',
        paint: {
          'circle-radius': {
            stops: [
              [0, 0],
              [20, radius / 0.075], // пиксели в зависимости от радиуса
            ],
            base: 2,
          },
          'circle-color': 'rgba(0, 150, 255, 0.2)',
        },
      });

      updateMarkers();

      map.current.on('moveend', () => {
        const newCenter = map.current.getCenter().toArray();
        const source = map.current.getSource('radius');
        if (source) {
          source.setData({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: newCenter,
            },
          });
        }

        if (onCenterChange) {
          onCenterChange(newCenter);
        }

        updateMarkers();
      });
    });
  }, []);

  const updateMarkers = () => {
    if (!map.current) return;

    // Удаляем старые маркеры
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    const center = map.current.getCenter().toArray();
    const centerPoint = turf.point(center);

    coffeeShops.forEach((shop) => {
      const shopCoords = [shop.longitude, shop.latitude];
      const shopPoint = turf.point(shopCoords);
      const distance = turf.distance(centerPoint, shopPoint, { units: 'meters' });

      if (distance <= radius) {
        const marker = new mapboxgl.Marker()
          .setLngLat(shopCoords)
          .setPopup(new mapboxgl.Popup().setText(shop.name))
          .addTo(map.current);

        markers.current.push(marker);
      }
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default CoffeeMap;