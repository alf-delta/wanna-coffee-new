import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '../assets/mapbox-token';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import GuideCoffeeCard from './GuideCoffeeCard.jsx';

if (!MAPBOX_TOKEN) {
  console.error('Mapbox token is missing!');
}

mapboxgl.accessToken = MAPBOX_TOKEN;

// Определение района по координатам
const getDistrictByCoordinates = (lat, lng) => {
  // Brooklyn boundaries
  if (lat >= 40.5700 && lat <= 40.7390 && lng >= -74.0410 && lng <= -73.8550) {
    return 'Brooklyn';
  }
  // Manhattan boundaries  
  if (lat >= 40.7000 && lat <= 40.8800 && lng >= -74.0300 && lng <= -73.9000) {
    return 'Manhattan';
  }
  // Queens boundaries
  if (lat >= 40.5500 && lat <= 40.8000 && lng >= -73.9500 && lng <= -73.7000) {
    return 'Queens';
  }
  return 'New York City'; // fallback
};

// Центры и зум для районов
const DISTRICT_CENTERS = {
  'Brooklyn': { center: [-73.9480, 40.6500], zoom: 11 },
  'Manhattan': { center: [-73.9650, 40.7500], zoom: 12 },
  'Queens': { center: [-73.8250, 40.7250], zoom: 11 },
  'Financial District': { center: [-74.009, 40.715], zoom: 14 },
  'New York City': { center: [-74.006, 40.7128], zoom: 10 }
};

function throttle(fn, wait) {
  let lastTime = 0;
  let timeout;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        lastTime = Date.now();
        fn.apply(this, args);
      }, wait - (now - lastTime));
    }
  };
}

// Функция фильтрации кофеен по радиусу
function getShopsInRadius(center, radius, shops) {
  return shops.filter(shop => {
    if (isNaN(shop.longitude) || isNaN(shop.latitude)) return false;
    const from = turf.point(center);
    const to = turf.point([shop.longitude, shop.latitude]);
    const dist = turf.distance(from, to, { units: 'meters' });
    return dist <= radius;
  });
}

const CoffeeMap = forwardRef(({ 
  coffeeShops = [], 
  radiusCircle = 1000, 
  selectedShop,
  disableMove = false, 
  mobileOffsetY = -120,
  highlightShopId = null,
  mapCenter,
  setMapCenter,
  onCloseSelectedShop
}, ref) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const programmaticMove = useRef(false);
  const isUserInteraction = useRef(false);
  const [error, setError] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const layersCreated = useRef(false);
  const [internalSelectedShop, setInternalSelectedShop] = useState(null);

  const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;
  const MOBILE_VISUAL_OFFSET = [0, mobileOffsetY];
  const NO_OFFSET = [0, 0];
  const currentVisualOffset = IS_MOBILE ? MOBILE_VISUAL_OFFSET : NO_OFFSET;

  console.log('CoffeeMap: Render/Props Update', { 
    radiusCircle, 
    selectedShop, 
    isMapLoaded, 
    currentVisualOffset
  });

  const updateMapVisuals = () => {
    if (!map.current || !isMapLoaded || !layersCreated.current || !mapCenter || mapCenter.length !== 2 || isNaN(mapCenter[0]) || isNaN(mapCenter[1])) {
      return;
    }
    // Градиентные концентрические круги
    const radii = [radiusCircle, radiusCircle * 0.7, radiusCircle * 0.4];
    const opacities = [0.13, 0.07, 0.03];
    radii.forEach((r, i) => {
      const id = `radius-gradient-${i}`;
      const circleGeoJson = turf.circle(mapCenter, r / 1000, { steps: 64, units: 'kilometers' });
      if (map.current.getSource(id)) {
        map.current.getSource(id).setData(circleGeoJson);
      } else {
        map.current.addSource(id, { type: 'geojson', data: circleGeoJson });
        map.current.addLayer({
          id: `${id}-layer`,
          type: 'fill',
          source: id,
          paint: {
            'fill-color': '#d3914b',
            'fill-opacity': opacities[i]
          }
        });
      }
    });
    // Центр как geojson точка
    const centerPoint = { type: 'Feature', geometry: { type: 'Point', coordinates: mapCenter } };
    if (map.current.getSource('center-point')) {
      map.current.getSource('center-point').setData(centerPoint);
    } else {
      map.current.addSource('center-point', { type: 'geojson', data: centerPoint });
      map.current.addLayer({
        id: 'center-point-layer',
        type: 'circle',
        source: 'center-point',
        paint: {
          'circle-radius': 8,
          'circle-color': '#d3914b',
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 2
        }
      });
    }
    // Маркеры кофеен
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    coffeeShops.forEach(shop => {
      // Функция для проверки, открыта ли кофейня сейчас
      const isOpenNow = (hoursStr) => {
        if (!hoursStr) return null;
        const [open, close] = hoursStr.split(/[–-]/).map(s => s.trim());
        if (!open || !close) return null;
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const nowStr = pad(now.getHours()) + ':' + pad(now.getMinutes());
        return open <= nowStr && nowStr < close;
      };

      const status = shop.hours ? isOpenNow(shop.hours) : null;
      const statusText = status === null ? '—' : status ? 'Open' : 'Closed';
      const statusColor = status === null ? '#ccc' : status ? '#4caf50' : '#e53935';
      
      const marker = new mapboxgl.Marker({ color: '#d3914b' })
        .setLngLat([shop.longitude, shop.latitude])
        .addTo(map.current);
      marker._shopId = shop.id;
      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        setInternalSelectedShop(shop);
      });
      markers.current.push(marker);
    });
    console.log('[DEBUG] Маркеры созданы:', markers.current.map(m => m && m._shopId), 'types:', markers.current.map(m => m && typeof m._shopId));
  };

  useEffect(() => {
    if (map.current) return; 
    let initialConfig = DISTRICT_CENTERS['Financial District'];
    // Для мобильных увеличиваем latitude (точка выше)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      initialConfig = {
        ...initialConfig,
        center: [initialConfig.center[0], initialConfig.center[1] + 0.012]
      };
    }
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initialConfig.center,
      zoom: initialConfig.zoom,
      attributionControl: false,
    });

    map.current.on('load', () => {
      setIsMapLoaded(true);
      const layerDefs = [
        { id: 'radius-outer', color: 'rgba(255,0,0,0.08)' },
        { id: 'radius-middle', color: 'rgba(255,75,75,0.12)' },
        { id: 'radius-inner', color: 'rgba(255,75,75,0.18)' },
        { id: 'center-point', color: '#d3914b', strokeColor: '#fff', strokeWidth: 2 }
      ];
      const initialGeoJsonCenter = map.current.getCenter().toArray();
      setMapCenter(initialGeoJsonCenter);
      layerDefs.forEach(def => {
        map.current.addSource(def.id, { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Point', coordinates: initialGeoJsonCenter } } });
        map.current.addLayer({
          id: `${def.id}-layer`,
          type: 'circle',
          source: def.id,
          paint: {
            'circle-radius': def.id === 'center-point' ? 8 : 0, 
            'circle-color': def.color,
            ...(def.strokeColor && { 'circle-stroke-color': def.strokeColor }),
            ...(def.strokeWidth && { 'circle-stroke-width': def.strokeWidth }),
          }
        });
      });
      layersCreated.current = true;
      updateMapVisuals(); 
    });

    map.current.on('move', () => {
      if (map.current) {
        const c = map.current.getCenter();
        setMapCenter([c.lng, c.lat]);
      }
    });

    if (!disableMove) {
      map.current.on('dragstart', () => {
        if (!isFlying) {
          console.log('[CM] User dragstart');
        }
      });
      map.current.on('zoomstart', () => {
        if (!isFlying) {
            console.log('[CM] User zoomstart');
        }
      });

      map.current.on('moveend', () => {
        console.log('[CM] moveend. Programmatic:', programmaticMove.current, 'UserInteraction:', isUserInteraction.current, 'isFlying:', isFlying);
        if (programmaticMove.current) {
            console.log("[CM] moveend after programmatic move. Updating visuals.");
            updateMapVisuals();
            return;
        }
        if (isUserInteraction.current) {
          const newGeographicCenter = map.current.getCenter().toArray();
          console.log('[CM] moveend after UserInteraction: new GeographicCenter from map.getCenter()', newGeographicCenter);
          if (setMapCenter) {
            if (!setMapCenter || Math.abs(newGeographicCenter[0] - setMapCenter[0]) > 1e-7 || Math.abs(newGeographicCenter[1] - setMapCenter[1]) > 1e-7) {
              console.log('[CM] moveend: User interaction, calling setMapCenter with new geographic center:', newGeographicCenter);
              setMapCenter(newGeographicCenter); 
            } else {
              console.log('[CM] moveend: User interaction, new center very close to prop, not calling setMapCenter. Updating visuals.');
              updateMapVisuals();
            }
          } else {
             updateMapVisuals();
          }
          isUserInteraction.current = false; 
        } else if (!isFlying) {
            console.log("[CM] moveend: non-flying, non-programmatic, non-user. Updating visuals.");
            updateMapVisuals();
        }
      });
    }

    const handleResize = () => {
        console.log("[CM] Window resized, re-flying to apply potentially changed offset and updating visuals.");
        if (map.current && setMapCenter && isMapLoaded) {
            const newIsMobile = (typeof window !== 'undefined' && window.innerWidth < 768);
            const updatedOffsetBasedOnProp = newIsMobile ? [0, mobileOffsetY] : NO_OFFSET;
            
            programmaticMove.current = true;
            setIsFlying(true);
            map.current.flyTo({
                center: setMapCenter,
                zoom: map.current.getZoom(),
                offset: updatedOffsetBasedOnProp,
                duration: 200
            });
            setTimeout(() => {
                setIsFlying(false);
                programmaticMove.current = false;
                updateMapVisuals();
            }, 300);
        }
    }
    window.addEventListener('resize', handleResize);
    map.current.on('error', (e) => { console.error('[CM] Mapbox error:', e); setError(e.message); });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (map.current) {
        map.current.remove();
        map.current = null;
        console.log("[CM] Map removed");
      }
    };
  }, []);

  useEffect(() => {
    if (isMapLoaded && layersCreated.current) {
      updateMapVisuals();
    }
  }, [setMapCenter, radiusCircle, coffeeShops]);

  // Синхронизация центра при перемещении карты
  useEffect(() => {
    if (!map.current || !setMapCenter) return;
    const handleMove = () => {
      const center = map.current.getCenter();
      setMapCenter([center.lng, center.lat]);
    };
    map.current.on('moveend', handleMove);
    return () => {
      if (map.current) {
        map.current.off('moveend', handleMove);
      }
    };
  }, [setMapCenter]);

  // Автоматический flyTo с offset при изменении mapCenter на мобильных
  // useEffect с flyTo по mapCenter временно удалён для устранения багов

  // Возвращает координаты точки выше центра карты на offsetY пикселей (только для мобильных)
  const getVisualCenter = (offsetY = 60) => {
    if (!map.current) return mapCenter;
    if (!IS_MOBILE) return mapCenter;
    const container = map.current.getContainer();
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Экранные координаты точки выше центра
    const screenX = width / 2;
    const screenY = height / 2 - offsetY;
    const lngLat = map.current.unproject([screenX, screenY]);
    return [lngLat.lng, lngLat.lat];
  };

  // Делаем функцию доступной через ref
  useImperativeHandle(ref, () => ({
    getVisualCenter,
    flyTo: (center, zoom) => {
      if (map.current) {
        map.current.flyTo({ center, zoom: zoom || map.current.getZoom() });
      }
    }
  }));

  const shopToShow = selectedShop || internalSelectedShop;
  if (error) {
    return <div style={{ padding: '1rem', textAlign: 'center', color: 'red' }}>Error loading map: {error}</div>;
  }

  const handleClosePopup = () => {
    setInternalSelectedShop(null);
    if (onCloseSelectedShop) onCloseSelectedShop();
  };

  return <>
    <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    {shopToShow && (
      <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 2000, background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleClosePopup}>
        <div style={{ maxWidth: 500, width: '90vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
          <GuideCoffeeCard coffeeShop={shopToShow} onClose={handleClosePopup} />
        </div>
      </div>
    )}
  </>;
});

export default CoffeeMap;