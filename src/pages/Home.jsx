import React, { useState, useRef, useCallback, useEffect } from 'react';
import CoffeeMap from '../components/CoffeeMap';
import FilterPanel from '../components/FilterPanel';
import CoffeeList from '../components/CoffeeList';
import { coffeeShops as coffeeShopsData } from '../utils/coffeeShops';
import * as turf from '@turf/turf';
import { filtersConfig } from '../filtersConfig';

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
  const [filters, setFilters] = useState(() => {
    // Инициализация фильтров по умолчанию из filtersConfig
    const initial = {};
    filtersConfig.forEach(f => {
      if (f.default) initial[f.key] = f.default;
      else if (f.multi) initial[f.key] = [];
      else initial[f.key] = false;
      if (f.nested) initial[f.nested.key] = '';
    });
    return initial;
  });
  const [selectedShopId, setSelectedShopId] = useState(null);

  const mapRef = useRef(null);

  // feetOptions[radiusIdx] — радиус в футах, переводим в метры для карты
  const radiusCircle = feetOptions[radiusIdx] / 3.28084;

  // Новая фильтрация кофеен по filters
  const filteredShops = coffeeShopsData
    .map(shop => {
      const shopCoords = [shop.longitude, shop.latitude];
      const centerPoint = turf.point(mapCenter);
      const shopPoint = turf.point(shopCoords);
      const distance = turf.distance(centerPoint, shopPoint, { units: 'meters' });
      return { ...shop, distance };
    })
    .filter(shop => shop.distance <= radiusCircle)
    .filter(shop => {
      // Coffee Type
      if (filters.coffeeType && filters.coffeeType.length > 0) {
        if (!shop.coffeeType || !filters.coffeeType.some(type => shop.coffeeType.includes(type))) return false;
      }
      // Roasting
      if (filters.roasting && filters.roasting.length > 0) {
        if (!shop.roasting || !filters.roasting.some(type => shop.roasting.includes(type))) return false;
      }
      // Roast Level (nested)
      if (filters.roast_level && filters.roast_level !== '') {
        if (!shop.roast_level || shop.roast_level !== filters.roast_level) return false;
      }
      // Brew Methods
      if (filters.brewMethods && filters.brewMethods.length > 0) {
        if (!shop.brewMethods || !filters.brewMethods.some(method => shop.brewMethods.includes(method))) return false;
      }
      // Barista
      if (filters.barista) {
        if (!shop.barista || !shop.barista.includes('sca_certified')) return false;
      }
      // Menu
      if (filters.menu && filters.menu.length > 0) {
        if (!shop.menu || !filters.menu.some(m => shop.menu.includes(m))) return false;
      }
      // Recognition
      if (filters.recognition) {
        if (!shop.recognition || !shop.recognition.includes('featured_guide')) return false;
      }
      return true;
    })
    .sort((a, b) => a.distance - b.distance);

  const handleShopClick = useCallback((shopId) => {
    setSelectedShopId(shopId);
  }, []);

  // --- СИНХРОНИЗАЦИЯ FILTERS <-> URL ---
  // 1. При загрузке страницы и изменении URL — инициализируем filters из query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newFilters = {};
    filtersConfig.forEach(f => {
      const val = params.get(f.key);
      if (val) {
        if (f.multi) newFilters[f.key] = val.split(',');
        else if (f.type === 'checkbox') newFilters[f.key] = val === 'true' ? true : val;
        else newFilters[f.key] = val;
      } else if (f.default) {
        newFilters[f.key] = f.default;
      } else if (f.multi) {
        newFilters[f.key] = [];
      } else {
        newFilters[f.key] = false;
      }
      if (f.nested) {
        const nestedVal = params.get(f.nested.key);
        newFilters[f.nested.key] = nestedVal || '';
      }
    });
    setFilters(newFilters);
    // eslint-disable-next-line
  }, []);

  // 2. При изменении filters сериализуем их в query-параметры
  useEffect(() => {
    const params = new URLSearchParams();
    filtersConfig.forEach(f => {
      const val = filters[f.key];
      if (f.multi && Array.isArray(val) && val.length > 0) {
        params.set(f.key, val.join(','));
      } else if (!f.multi && val) {
        params.set(f.key, val === true ? 'true' : val);
      }
      if (f.nested && filters[f.nested.key]) {
        params.set(f.nested.key, filters[f.nested.key]);
      }
    });
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  return (
    <div style={styles.home}>
      <div style={styles.content}>
        <div style={styles.sidebar}>
          <div style={styles.filterBlock}>
            <FilterPanel
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