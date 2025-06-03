import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '../assets/mapbox-token';
import 'mapbox-gl/dist/mapbox-gl.css';

if (!MAPBOX_TOKEN) {
  console.error('Mapbox token is missing!');
}

mapboxgl.accessToken = MAPBOX_TOKEN;

const CoffeeMap = forwardRef(({ coffeeShops = [], radiusCircle = 1000, setMapCenter, mapCenter, selectedShopId, disableMove = false, mobileOffsetY = -120 }, ref) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [error, setError] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const layersCreated = useRef(false);
  const initialZoom = 15;
  const isUserInteraction = useRef(false);
  const programmaticMove = useRef(false);
  const prevRadius = useRef(radiusCircle);

  const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;
  const MOBILE_VISUAL_OFFSET = [0, mobileOffsetY];
  const NO_OFFSET = [0, 0];
  const currentVisualOffset = IS_MOBILE ? MOBILE_VISUAL_OFFSET : NO_OFFSET;

  console.log('CoffeeMap: Render/Props Update', { radiusCircle, mapCenterProp: mapCenter, selectedShopId, isMapLoaded, currentVisualOffset });

  const executeFlyTo = (targetCenter, targetZoom, duration = 600) => {
    if (!map.current || !targetCenter || targetCenter.length !== 2 || isNaN(targetCenter[0]) || isNaN(targetCenter[1])) {
      console.warn('[CM] executeFlyTo: Invalid targetCenter or map not ready', { targetCenter, mapReady: !!map.current });
      return;
    }
    console.log('[CM] executeFlyTo:', { targetCenter, targetZoom, offset: currentVisualOffset, duration });
    programmaticMove.current = true;
    setIsFlying(true);
    map.current.flyTo({
      center: targetCenter,
      zoom: targetZoom,
      duration: duration,
      offset: currentVisualOffset,
      essential: true,
    });
    setTimeout(() => {
      setIsFlying(false);
      programmaticMove.current = false;
      console.log("[CM] executeFlyTo finished, programmaticMove set to false");
    }, duration + 100); 
  };

  useImperativeHandle(ref, () => ({
    openPopup: (shopId) => {
      const marker = markers.current.find(m => m._shopId === shopId);
      if (marker) {
        markers.current.forEach(m => { 
          if (m.getPopup() && m.getPopup().isOpen()) m.getPopup().remove();
        });
        marker.getPopup().addTo(map.current);
        const lngLat = marker.getLngLat();
        executeFlyTo([lngLat.lng, lngLat.lat], map.current.getZoom() < 15 ? 15 : map.current.getZoom(), 1000);
      }
    },
    highlightMarker: (shopId) => {
      markers.current.forEach(marker => {
        marker.getElement().style.filter = marker._shopId === shopId ? 'drop-shadow(0 0 8px #d3914b)' : 'none';
      });
    },
    flyTo: (center, zoom = 15) => { 
      console.log("[CM] Imperative flyTo called with center:", center);
      if (setMapCenter) {
        if (!mapCenter || Math.abs(center[0] - mapCenter[0]) > 1e-6 || Math.abs(center[1] - mapCenter[1]) > 1e-6) {
            setMapCenter(center);
        } else {
            executeFlyTo(center, zoom, 1000);
        }
      } else {
          executeFlyTo(center, zoom, 1000);
      }
    }
  }));

  const updateMapVisuals = () => {
    if (!map.current || !isMapLoaded || !layersCreated.current || !mapCenter || mapCenter.length !== 2 || isNaN(mapCenter[0]) || isNaN(mapCenter[1])) {
      console.warn('[CM] updateMapVisuals skipped: conditions not met', {isMapLoaded, layersCreated: layersCreated.current, mapCenter});
      return;
    }
    console.log('[CM] updateMapVisuals: Drawing GeoJSON at logical mapCenter (prop):', mapCenter);

    const centerForGeoJSON = [mapCenter[0], mapCenter[1]];
    const zoom = map.current.getZoom();
    const metersPerPixel = 156543.03392 * Math.cos(centerForGeoJSON[1] * Math.PI / 180) / Math.pow(2, zoom);
    const radiusInPixels = radiusCircle / metersPerPixel;

    const pointFeature = { type: 'Feature', geometry: { type: 'Point', coordinates: centerForGeoJSON } };
    ['radius-inner', 'radius-middle', 'radius-outer', 'center-point'].forEach(sourceId => {
      const source = map.current.getSource(sourceId);
      if (source) source.setData(pointFeature);
      else console.warn(`[CM] Source ${sourceId} not found during updateMapVisuals`);
    });

    const minRadius = Math.min(mapContainer.current ? mapContainer.current.offsetWidth / 10 : 30, 60);
    const paintLayers = [
      { id: 'radius-outer-layer', radius: Math.max(radiusInPixels * 2.2, minRadius * 1.2) },
      { id: 'radius-middle-layer', radius: Math.max(radiusInPixels * 1.5, minRadius * 0.9) },
      { id: 'radius-inner-layer', radius: Math.max(radiusInPixels * 1.0, minRadius * 0.6) },
      { id: 'center-point-layer', radius: Math.max(minRadius * 0.1, 6) }
    ];
    paintLayers.forEach(layer => {
      if (map.current.getLayer(layer.id)) map.current.setPaintProperty(layer.id, 'circle-radius', layer.radius);
    });

    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    coffeeShops.forEach(shop => {
      if (isNaN(shop.longitude) || isNaN(shop.latitude)) return;
      const popupHTML = `<h3>${shop.name}</h3><p>${shop.address}</p><button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}', '_blank')">Route</button>`;
      const marker = new mapboxgl.Marker({ color: shop.id === selectedShopId ? 'gold' : '#FF4B4B' })
        .setLngLat([shop.longitude, shop.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML)); 
      marker.addTo(map.current);
      marker._shopId = shop.id;
      markers.current.push(marker);
    });
    console.log("[CM] updateMapVisuals completed");
  };

  useEffect(() => {
    if (map.current) return; 
    console.log("[CM] Initializing map with center:", mapCenter);
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: mapCenter || [-74.006, 40.7128], 
      zoom: initialZoom,
      attributionControl: false,
    });

    map.current.on('load', () => {
      console.log('[CM] Map loaded event.');
      setIsMapLoaded(true);
      const layerDefs = [
        { id: 'radius-outer', color: 'rgba(255,0,0,0.08)' },
        { id: 'radius-middle', color: 'rgba(255,75,75,0.12)' },
        { id: 'radius-inner', color: 'rgba(255,75,75,0.18)' },
        { id: 'center-point', color: '#FF4B4B', strokeColor: '#FFFFFF', strokeWidth: 2 }
      ];
      const initialGeoJsonCenter = mapCenter || [-74.006, 40.7128];
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
      console.log("[CM] Layers created. Initial mapCenter:", mapCenter);
      if (mapCenter) {
         console.log('[CM] Initial flyTo after load with offset.');
         executeFlyTo(mapCenter, initialZoom, 100);
      }
      updateMapVisuals(); 
    });

    if (!disableMove) {
      map.current.on('dragstart', () => {
        if (!isFlying) {
          console.log('[CM] User dragstart');
          isUserInteraction.current = true;
        }
      });
      map.current.on('zoomstart', () => {
        if (!isFlying) {
            console.log('[CM] User zoomstart');
            isUserInteraction.current = true;
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
            if (!mapCenter || Math.abs(newGeographicCenter[0] - mapCenter[0]) > 1e-7 || Math.abs(newGeographicCenter[1] - mapCenter[1]) > 1e-7) {
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
        if (map.current && mapCenter && isMapLoaded) {
            const newIsMobile = (typeof window !== 'undefined' && window.innerWidth < 768);
            const updatedOffsetBasedOnProp = newIsMobile ? [0, mobileOffsetY] : NO_OFFSET;
            
            programmaticMove.current = true;
            setIsFlying(true);
            map.current.flyTo({
                center: mapCenter,
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
    console.log("[CM] mapCenter prop changed to:", mapCenter, "isMapLoaded:", isMapLoaded, "layersCreated:", layersCreated.current);
    if (!map.current || !isMapLoaded || !layersCreated.current || !mapCenter) return;

    if (!programmaticMove.current) {
        console.log('[CM] mapCenter prop changed externally, executing flyTo with offset:', mapCenter);
        executeFlyTo(mapCenter, map.current.getZoom()); 
    } else {
        console.log("[CM] mapCenter prop changed, but programmaticMove is true, likely internal feedback. Skipping flyTo, just updating visuals.");
    }
    updateMapVisuals(); 
  }, [mapCenter]); 

  useEffect(() => {
    console.log("[CM] radiusCircle prop changed to:", radiusCircle, "isMapLoaded:", isMapLoaded, "layersCreated:", layersCreated.current);
    if (!map.current || !isMapLoaded || !layersCreated.current || !mapCenter) return;
    
    updateMapVisuals(); 
    prevRadius.current = radiusCircle;
  }, [radiusCircle]); 

  useEffect(() => {
    console.log("[CM] coffeeShops or selectedShopId changed. Updating visuals.");
    if (isMapLoaded && layersCreated.current) {
      updateMapVisuals();
    }
  }, [coffeeShops, selectedShopId]);

  if (error) {
    return <div style={{ padding: '1rem', textAlign: 'center', color: 'red' }}>Error loading map: {error}</div>;
  }

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
});

export default CoffeeMap;