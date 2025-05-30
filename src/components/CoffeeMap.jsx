import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '../assets/mapbox-token';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';

if (!MAPBOX_TOKEN) {
  console.error('Mapbox token is missing!');
}

mapboxgl.accessToken = MAPBOX_TOKEN;

const CoffeeMap = forwardRef(({ coffeeShops = [], radiusCircle = 1000, setMapCenter, mapCenter, selectedShopId }, ref) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [error, setError] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const layersCreated = useRef(false);
  const pendingPopupId = useRef(null);
  // Стартовый zoom для более крупного масштаба (15 — несколько кварталов)
  const initialZoom = 15;

  console.log('CoffeeMap: props changed', { radiusCircle, coffeeShopsCount: coffeeShops.length });

  useImperativeHandle(ref, () => ({
    openPopup: (shopId) => {
      console.log('openPopup called with shopId:', shopId);
      if (!map.current) return;
      // Закрываем все попапы
      markers.current.forEach(marker => {
        if (marker.getPopup() && marker.getPopup().isOpen()) {
          marker.getPopup().remove();
        }
      });
      // Открываем попап только у нужного маркера
      const marker = markers.current.find(m => m._shopId === shopId);
      console.log('Found marker for shopId:', shopId, marker);
      if (marker) {
        marker.getPopup().addTo(map.current);
        const lngLat = marker.getLngLat();
        map.current.flyTo({
          center: [lngLat.lng, lngLat.lat],
          zoom: 15,
          duration: 1000
        });
      }
    },
    flyTo: (center, zoom = 15) => {
      console.log('flyTo called with:', { center, zoom });
      if (!map.current) {
        console.error('Map is not initialized');
        return;
      }
      setIsFlying(true);
      map.current.flyTo({
        center,
        zoom,
        duration: 1000,
        essential: true
      });
      setTimeout(() => setIsFlying(false), 1000);
    }
  }));

  // Функция для получения центра карты в пикселях
  const getMapCenter = () => {
    if (!map.current) return null;
    if (window.innerWidth <= 768) {
      const offset = 180;
      const center = map.current.getCenter();
      const px = map.current.project(center);
      const centerLngLat = map.current.unproject([px.x, px.y - offset]);
      return {
        lng: centerLngLat.lng,
        lat: centerLngLat.lat
      };
    } else {
      const center = map.current.getCenter();
      return {
        lng: center.lng,
        lat: center.lat
      };
    }
  };

  // Функция для обновления радиуса и маркеров
  const updateMap = () => {
    console.log('updateMap вызван');
    console.log('filteredShops:', coffeeShops);
    if (!map.current || !isMapLoaded) {
      console.log('updateMap прерван: map:', !!map.current, 'isMapLoaded:', isMapLoaded);
      return;
    }
    // Проверяем, что все нужные слои существуют
    const requiredLayers = ['radius-outer-layer', 'radius-middle-layer', 'radius-inner-layer', 'center-point-layer'];
    const allMapLayersExist = requiredLayers.every(id => map.current.getLayer(id));
    if (!allMapLayersExist) {
      console.warn('Не все слои существуют, updateMap не будет вызван');
      return;
    }

    const center = getMapCenter();
    if (!center) return;

    // ЛОГИРОВАНИЕ
    console.log('updateMap: center', center);
    console.log('updateMap: radiusCircle', radiusCircle);
    console.log('updateMap: coffeeShops', coffeeShops.length, coffeeShops.map(s => [s.name, s.longitude, s.latitude]));

    // Обновляем центр в родительском компоненте
    if (setMapCenter) {
      setMapCenter([center.lng, center.lat]);
    }

    // Обновляем радиус
    const zoom = map.current.getZoom();
    const metersPerPixel = 156543.03392 * Math.cos(center.lat * Math.PI / 180) / Math.pow(2, zoom);
    const radiusInPixels = radiusCircle / metersPerPixel;
    console.log('radiusInPixels:', radiusInPixels, 'radiusCircle:', radiusCircle, 'metersPerPixel:', metersPerPixel);

    // Обновляем круги радиуса
    const point = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [center.lng, center.lat],
      },
    };
    console.log('updateMap: обновляю geojson для слоёв с центром:', [center.lng, center.lat]);

    ['radius-inner', 'radius-middle', 'radius-outer', 'center-point'].forEach(sourceId => {
      const source = map.current.getSource(sourceId);
      if (source) {
        source.setData(point);
        console.log('updateMap: обновил source:', sourceId, 'координаты:', [center.lng, center.lat]);
      } else {
        console.warn('updateMap: source не найден:', sourceId);
      }
    });

    // Обновляем размеры кругов
    const minRadius = 60;
    const outer = Math.max(radiusInPixels * 2.2, minRadius);
    const middle = Math.max(radiusInPixels * 1.5, minRadius * 0.8);
    const inner = Math.max(radiusInPixels * 1.0, minRadius * 0.5);
    const layers = [
      { id: 'radius-outer', color: 'rgba(255, 0, 0, 0.12)', radius: outer },
      { id: 'radius-middle', color: 'rgba(255, 75, 75, 0.18)', radius: middle },
      { id: 'radius-inner', color: 'rgba(255, 75, 75, 0.28)', radius: inner },
      { id: 'center-point', radius: 8 }
    ];

    layers.forEach(layer => {
      const layerId = `${layer.id}-layer`;
      if (map.current.getLayer(layerId)) {
        console.log('setPaintProperty:', layerId, 'circle-radius:', layer.radius);
        map.current.setPaintProperty(layerId, 'circle-radius', layer.radius);
      }
    });

    // Обновляем маркеры
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    console.log('updateMap: создаю маркеры для кофеен, всего:', coffeeShops.length);
    coffeeShops.forEach(shop => {
      console.log('updateMap: маркер для', shop.name, [shop.longitude, shop.latitude]);
      if (isNaN(shop.longitude) || isNaN(shop.latitude)) {
        console.warn('Некорректные координаты для маркера:', shop);
        return;
      }
      const shopCoords = [shop.longitude, shop.latitude];
      const markerColor = shop.id === selectedShopId ? 'gold' : '#FF4B4B';
      const marker = new mapboxgl.Marker({
        color: markerColor
      })
        .setLngLat(shopCoords)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h3 style="margin: 0 0 8px 0; font-size: 16px;">${shop.name}</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px;">${shop.address}</p>
              <button
                onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}', '_blank')"
                style="display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; border: 1px solid #eee; background: #fff; cursor: pointer; font-size: 14px;"
                title="Open in Google Maps"
              >
                <span>🚶‍♂️</span>
                <span style="font-weight: bold; font-size: 18px;">→</span>
                <span style="display:inline-flex;vertical-align:middle;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                    <g>
                      <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.9 0 5.5 1 7.6 2.7l6-6C34.3 5.1 29.4 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"/>
                      <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c2.9 0 5.5 1 7.6 2.7l6-6C34.3 5.1 29.4 3 24 3 15.6 3 8.1 8.5 6.3 14.7z"/>
                      <path fill="#FBBC05" d="M24 43c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.5 34.9 26.9 36 24 36c-5.6 0-10.3-3.8-12-9l-6.6 5.1C8.1 39.5 15.6 45 24 45z"/>
                      <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-3.6 5.1-6.3 6.1l6.5 5.3C41.2 36.1 44 30.9 44 24c0-1.3-.1-2.7-.4-4z"/>
                    </g>
                  </svg>
                </span>
              </button>
            `)
        );
      marker.addTo(map.current);
      marker._shopId = shop.id;
      markers.current.push(marker);
    });
    console.log('updateMap: маркеры обновлены, всего:', markers.current.length);
  };

  useEffect(() => {
    if (map.current) return;

    try {
      console.log('Initializing map...');
      if (!mapContainer.current) {
        console.error('Map container is not available');
        setError('Map container is not available');
        return;
      }

      const containerRect = mapContainer.current.getBoundingClientRect();
      console.log('Map container dimensions:', containerRect.width, containerRect.height);
      if (containerRect.width === 0 || containerRect.height === 0) {
        console.warn('Map container has zero dimensions. Map may not be visible.');
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: mapCenter,
        zoom: initialZoom,
        attributionControl: false,
      });

      console.log('Map instance created:', map.current);

      const initializeLayers = () => {
        console.log('=== INITIALIZE LAYERS НАЧАЛО ===');
        setIsMapLoaded(true);
        
        // Создаём слои для радиуса и точки только один раз
        const layers = [
          { id: 'radius-outer', color: 'rgba(255, 0, 0, 0.12)', radius: 1.0 },
          { id: 'radius-middle', color: 'rgba(255, 75, 75, 0.18)', radius: 0.8 },
          { id: 'radius-inner', color: 'rgba(255, 75, 75, 0.28)', radius: 0.5 },
          { id: 'center-point', color: '#FF4B4B', radius: 8, stroke: true }
        ];
        
        let allLayersCreated = true;
        layers.forEach(layer => {
          // Проверяем, существует ли source
          if (!map.current.getSource(layer.id)) {
            try {
              console.log('Создаю source:', layer.id);
              map.current.addSource(layer.id, {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: map.current.getCenter().toArray(),
                  },
                },
              });
              console.log('Source создан:', layer.id);
            } catch (e) {
              console.error('Ошибка при создании source:', layer.id, e);
              allLayersCreated = false;
            }
          } else {
            console.log('Source уже существует:', layer.id);
          }
          // Проверяем, существует ли layer
          if (!map.current.getLayer(`${layer.id}-layer`)) {
            try {
              console.log('Создаю layer:', `${layer.id}-layer`);
              const paint = {
                'circle-radius': layer.stroke ? layer.radius : 0,
                'circle-color': layer.color,
                'circle-stroke-width': layer.stroke ? 2 : 0,
              };
              if (layer.stroke) {
                paint['circle-stroke-color'] = '#FFFFFF';
              }
              map.current.addLayer({
                id: `${layer.id}-layer`,
                type: 'circle',
                source: layer.id,
                paint,
              });
              console.log('Layer created:', `${layer.id}-layer`);
            } catch (e) {
              console.error('Ошибка при создании слоя:', `${layer.id}-layer`, e);
              allLayersCreated = false;
            }
          } else {
            console.log('Layer уже существует:', `${layer.id}-layer`);
          }
        });

        layersCreated.current = allLayersCreated;
        console.log('=== INITIALIZE LAYERS КОНЕЦ, layersCreated:', allLayersCreated, '===');
        
        if (allLayersCreated) {
          updateMap();
        }
      };

      // Проверяем, загружена ли карта уже
      if (map.current.loaded()) {
        console.log('Карта уже загружена, инициализируем слои сразу');
        initializeLayers();
      } else {
        console.log('Карта ещё не загружена, ждём события load');
        map.current.on('load', initializeLayers);
      }

      // Обновляем карту при движении
      map.current.on('moveend', () => {
        if (!isFlying) {
          const center = map.current.getCenter();
          if (setMapCenter) {
            setMapCenter([center.lng, center.lat]);
          }
          updateMap();
        }
      });

      // Обновляем карту при изменении размера окна
      window.addEventListener('resize', updateMap);

      map.current.on('error', (error) => {
        console.error('Mapbox error:', error);
        setError(error.message);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setError(error.message);
    }

    return () => {
      window.removeEventListener('resize', updateMap);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Обновляем карту при изменении радиуса или кофеен
  useEffect(() => {
    console.log('CoffeeMap: useEffect radiusCircle', { radiusCircle, layersCreated: layersCreated.current });
    if (map.current && isMapLoaded && layersCreated.current) {
      updateMap();
    }
  }, [radiusCircle, coffeeShops, isMapLoaded]);

  // Обработка выбранной кофейни
  useEffect(() => {
    if (!selectedShopId || !map.current || !isMapLoaded) return;
    
    console.log('CoffeeMap: selectedShopId changed', { selectedShopId });
    const marker = markers.current.find(m => m._shopId === selectedShopId);
    if (marker) {
      pendingPopupId.current = selectedShopId;
      setIsFlying(true);
      // map.current.flyTo({
      //   center: marker.getLngLat(),
      //   zoom: 15,
      //   duration: 1000
      // });
    } else {
      // Если маркер ещё не создан, сохраняем pendingPopupId
      pendingPopupId.current = selectedShopId;
    }
  }, [selectedShopId, isMapLoaded]);

  // После завершения анимации (moveend) или обновления маркеров открываем попап, если есть pendingPopupId
  useEffect(() => {
    console.log('Попытка открыть попап:', { selectedShopId, isFlying, markers: markers.current.length });
    if (!selectedShopId) return;
    const marker = markers.current.find(m => m._shopId === selectedShopId);
    if (marker) {
      console.log('Маркер найден, открываю попап:', marker._shopId);
      marker.getPopup().addTo(map.current);
      pendingPopupId.current = null;
    } else {
      console.log('Маркер НЕ найден для:', selectedShopId);
    }
  }, [coffeeShops, isMapLoaded, selectedShopId]);

  if (error) {
    return (
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        color: '#dc3545'
      }}>
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          <h3>Error loading map</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
});

export default CoffeeMap;