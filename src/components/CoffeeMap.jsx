import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '../assets/mapbox-token';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';

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
  selectedShopId, 
  disableMove = false, 
  mobileOffsetY = -120,
  highlightShopId = null,
  mapCenter,
  setMapCenter
}, ref) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [error, setError] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const layersCreated = useRef(false);

  const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;
  const MOBILE_VISUAL_OFFSET = [0, mobileOffsetY];
  const NO_OFFSET = [0, 0];
  const currentVisualOffset = IS_MOBILE ? MOBILE_VISUAL_OFFSET : NO_OFFSET;

  console.log('CoffeeMap: Render/Props Update', { 
    radiusCircle, 
    selectedShopId, 
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
      const popupHTML = `<h3>${shop.name}</h3><p>${shop.address}</p><button onclick=\"window.open('https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}', '_blank')\">Route</button>`;
      const marker = new mapboxgl.Marker({ color: '#d3914b' })
        .setLngLat([shop.longitude, shop.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML));
      marker.addTo(map.current);
      marker._shopId = shop.id;
      markers.current.push(marker);
    });
  };

  useEffect(() => {
    if (map.current) return; 
    const initialConfig = DISTRICT_CENTERS['New York City'];
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

  if (error) {
    return <div style={{ padding: '1rem', textAlign: 'center', color: 'red' }}>Error loading map: {error}</div>;
  }

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
});

export default CoffeeMap;