import React, { useState, useRef, useCallback } from 'react';
import CoffeeMap from '../components/CoffeeMap';
import FilterPanel from '../components/FilterPanel';
import CoffeeList from '../components/CoffeeList';
import { coffeeShops as coffeeShopsData } from '../utils/coffeeShops';
import * as turf from '@turf/turf';

const feetOptions = [750, 1500, 2500, 3500, 5000];

const styles = {
  home: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    minHeight: 0,
  },
  sidebar: {
    width: 320,
    minWidth: 320,
    maxWidth: 400,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
    zIndex: 2,
    overflow: 'auto',
    padding: '1rem',
    gap: '1rem',
  },
  mapContainer: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    position: 'relative',
  },
  filterBlock: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  listBlock: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flex: 1,
    overflowY: 'auto',
  }
};

const Home = () => {
  const [radiusIdx, setRadiusIdx] = useState(2); // по умолчанию 8 min
  const [mapCenter, setMapCenter] = useState([-73.9459401, 40.8077971]);
  const [filters, setFilters] = useState({ features: [] });
  const [selectedShopId, setSelectedShopId] = useState(null);

  const mapRef = useRef(null);

  // feetOptions[radiusIdx] — радиус в футах, переводим в метры для карты
  const radiusCircle = feetOptions[radiusIdx] / 3.28084;

  // Фильтрация кофеен по радиусу и признакам
  const filteredShops = coffeeShopsData
    .map(shop => {
      const shopCoords = [shop.longitude, shop.latitude];
      const centerPoint = turf.point(mapCenter);
      const shopPoint = turf.point(shopCoords);
      const distance = turf.distance(centerPoint, shopPoint, { units: 'meters' });
      return { ...shop, distance };
    })
    .filter(shop => shop.distance <= radiusCircle)
    .filter(shop =>
      filters.features.length === 0 ||
      filters.features.every(feature => shop.features.includes(feature))
    )
    .sort((a, b) => a.distance - b.distance);

  const handleShopClick = useCallback((shopId) => {
    setSelectedShopId(shopId);
  }, []);

  return (
    <div style={styles.home}>
      <div style={styles.content}>
        <div style={styles.sidebar}>
          <div style={styles.filterBlock}>
            <FilterPanel
              radiusIdx={radiusIdx}
              setRadiusIdx={setRadiusIdx}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
          <div style={styles.listBlock}>
            <CoffeeList
              coffeeShops={filteredShops}
              onShopClick={handleShopClick}
            />
          </div>
        </div>
        <div style={styles.mapContainer}>
          <CoffeeMap
            ref={mapRef}
            coffeeShops={filteredShops}
            radiusCircle={radiusCircle}
            setMapCenter={setMapCenter}
            mapCenter={mapCenter}
            selectedShopId={selectedShopId}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;