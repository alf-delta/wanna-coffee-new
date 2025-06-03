import React, { useState, useRef, useCallback, useEffect } from 'react';
import CoffeeMap from '../components/CoffeeMap';
import FilterPanel from '../components/FilterPanel';
import CoffeeList from '../components/CoffeeList';
import { coffeeShops as coffeeShopsData } from '../utils/coffeeShops';
import * as turf from '@turf/turf';
import { filtersConfig } from '../filtersConfig';
import Modal from '../components/Modal';

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
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    },
  },
  sidebar: {
    width: 380,
    minWidth: 380,
    maxWidth: 380,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    zIndex: 2,
    overflow: 'auto',
    padding: '1rem',
    gap: '0.75rem',
    margin: '12px',
    height: 'calc(100vh - 24px)',
    '@media (max-width: 768px)': {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: '85%',
      maxWidth: '320px',
      transform: 'translateX(-100%)',
      transition: 'transform 0.3s ease-in-out',
      zIndex: 1000,
      margin: 0,
      borderRadius: 0,
      height: '100vh',
    },
  },
  sidebarVisible: {
    '@media (max-width: 768px)': {
      transform: 'translateX(0)',
    },
  },
  mapContainer: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    position: 'relative',
    '@media (max-width: 768px)': {
      height: 'calc(100vh - 60px)',
    },
  },
  mapWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'relative',
    '@media (max-width: 768px)': {
      borderRadius: '12px',
    },
  },
  mapWrapperBorder: {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  },
  filterBlock: {
    backgroundColor: 'white',
    borderRadius: '6px',
    padding: '0.75rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  listBlock: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flex: 1,
    overflowY: 'auto',
  },
  mobileControls: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'flex',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60px',
      background: 'white',
      boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
  },
  mobileButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px',
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
  },
  mobileButtonActive: {
    color: '#d3914b',
  },
  overlay: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 999,
    },
  },
  fabFilter: {
    position: 'fixed',
    bottom: 80,
    right: 20,
    zIndex: 1200,
    background: '#fff',
    color: '#d3914b',
    borderRadius: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    padding: '12px 20px',
    fontWeight: 600,
    fontSize: '1rem',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
  closeModalBtn: {
    marginTop: 16,
    width: '100%',
    padding: '12px',
    background: '#d3914b',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
  },
  mobileListScroll: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    gap: 12,
    padding: '0.5rem 0.5rem 0.5rem 1rem',
    background: '#fff',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 56,
    zIndex: 100,
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
  mobileTopBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 1rem 0.5rem 1rem',
    background: '#fff',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 0,
    zIndex: 110,
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
  fabFilterTop: {
    background: '#fff',
    color: '#d3914b',
    borderRadius: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '1rem',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  coffeeCount: {
    fontWeight: 500,
    fontSize: '1rem',
    color: '#333',
  },
  mobileListScrollBottom: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    gap: 12,
    padding: '0.5rem 0.5rem 0.5rem 1rem',
    background: '#fff',
    borderTop: '1px solid #eee',
    borderBottom: 'none',
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 60,
    zIndex: 110,
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
  mobileBottomBar: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 60,
    zIndex: 120,
    background: '#fff',
    borderTop: '1px solid #eee',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
  mobileFiltersRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    padding: '0.5rem 1rem 0.25rem 1rem',
  },
  fabFilterBottom: {
    background: '#fff',
    color: '#d3914b',
    borderRadius: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '1rem',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  mobileBottomBarFixed: {
    position: 'fixed',
    left: 12,
    right: 12,
    bottom: 12,
    zIndex: 120,
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    '@media (min-width: 769px)': {
      display: 'none',
    },
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    padding: 0,
  },
  mobileFiltersRowFixed: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    padding: '0.75rem 1rem 0.5rem 0.5rem',
    borderBottom: '1px solid #f2f2f2',
  },
  mobileListScrollFixed: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    gap: 12,
    padding: '0.75rem 0.75rem 0 1rem',
    background: '#fff',
    borderTop: 'none',
    borderBottom: 'none',
    position: 'static',
    scrollbarWidth: 'thin',
    scrollbarColor: '#bbb #f5f5f5',
  },
  mobileSliderContainer: {
    padding: '0.75rem 1rem 0.75rem 1rem',
    background: '#fff',
    borderTop: '1px solid #f2f2f2',
    borderRadius: '0 0 16px 16px',
  },
  mobileSliderWrapper: {
    width: '85%',
    margin: '0 auto',
  },
  '@global': {
    '.mobileListScrollFixed::-webkit-scrollbar': {
      height: '3px',
      background: '#f5f5f5',
    },
    '.mobileListScrollFixed::-webkit-scrollbar-thumb': {
      background: '#bbb',
      borderRadius: '2px',
    },
  },
  fabFilterDesktop: {
    background: '#fff',
    color: '#d3914b',
    borderRadius: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '1rem',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '0 0 1rem 0',
    cursor: 'pointer',
    minWidth: 160,
    height: 48,
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  desktopTopRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  geoButton: {
    background: '#fff',
    color: '#d3914b',
    borderRadius: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '1rem',
    border: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    minWidth: 160,
    height: 48,
    position: 'fixed',
    right: 32,
    bottom: 32,
    zIndex: 1201,
    '@media (max-width: 768px)': {
      position: 'static',
      right: 'auto',
      bottom: 'auto',
      minWidth: 0,
      height: 'auto',
    },
  },
  mobileGeoButton: {
    background: '#fff',
    color: '#d3914b',
    borderRadius: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    padding: '8px 12px',
    fontWeight: 600,
    fontSize: '1rem',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    minWidth: 0,
    height: 40,
    marginLeft: 0,
  },
};

// SVG иконка pin (location marker)
const LocationIcon = ({ size = 22, color = '#d3914b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={color}/>
  </svg>
);

// Кастомные стили для слайдера радиуса
const sliderStyle = {
  width: '100%',
  accentColor: '#d3914b',
  height: '4px',
  borderRadius: '2px',
  background: '#fff',
  outline: 'none',
  margin: '0',
  marginBottom: '8px',
};

const Home = () => {
  const [radiusIdx, setRadiusIdx] = useState(0); // минимальный радиус по умолчанию
  const [mapCenter, setMapCenter] = useState([-74.009, 40.707]); // Financial District, Manhattan
  const [filters, setFilters] = useState(() => {
    // Инициализация фильтров всегда пустыми значениями
    const initial = {};
    filtersConfig.forEach(f => {
      if (f.multi) initial[f.key] = [];
      else initial[f.key] = false;
      if (f.nested) initial[f.nested.key] = '';
    });
    return initial;
  });
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeView, setActiveView] = useState('map'); // 'map' или 'list'
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

  // Обработчик изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUseLocation = () => {
    console.log('handleUseLocation called');
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      alert('Geolocation is not supported by your browser');
      return;
    }

    console.log('Requesting geolocation...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Geolocation success:', position);
        const newCenter = [position.coords.longitude, position.coords.latitude];
        console.log('New center:', newCenter);
        setMapCenter(newCenter);
        if (mapRef.current) {
          console.log('Flying to new location...');
          mapRef.current.flyTo(newCenter, 15);
        } else {
          console.error('mapRef.current is not available');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to retrieve your location';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Please allow location access to use this feature';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div style={styles.home}>
      <div style={styles.content}>
        {/* Сайдбар и фильтры только для десктопа */}
        {!isMobileView && (
          <div style={{
            ...styles.sidebar,
            ...(showSidebar && styles.sidebarVisible)
          }}>
            <div style={styles.desktopTopRow}>
              <button
                style={styles.fabFilterDesktop}
                onClick={() => setIsFilterModalOpen(true)}
              >
                <span role="img" aria-label="filter">🔎</span> Filters
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="radius-slider" style={{ fontWeight: 500, fontSize: '1rem', color: '#d3914b', display: 'block', marginBottom: 6 }}>
                Search radius: {feetOptions[radiusIdx]} ft
              </label>
              <input
                id="radius-slider"
                type="range"
                min={0}
                max={feetOptions.length - 1}
                value={radiusIdx}
                onChange={e => setRadiusIdx(Number(e.target.value))}
                style={sliderStyle}
                className="radius-slider"
              />
            </div>
            <div style={styles.listBlock}>
              <CoffeeList
                coffeeShops={filteredShops}
                onShopClick={handleShopClick}
              />
            </div>
          </div>
        )}
        {showSidebar && <div style={styles.overlay} onClick={() => setShowSidebar(false)} />}
        <div style={{
          ...styles.mapContainer,
          display: isMobileView && activeView === 'list' ? 'none' : 'block'
        }}>
          <div style={styles.mapWrapper}>
            <div style={styles.mapWrapperBorder} />
            <CoffeeMap
              ref={mapRef}
              coffeeShops={filteredShops}
              radiusCircle={radiusCircle}
              setMapCenter={setMapCenter}
              mapCenter={mapCenter}
              selectedShopId={selectedShopId}
            />
          </div>
          {/* Плавающая кнопка геолокации только на десктопе */}
          {!isMobileView && (
            <button
              style={styles.geoButton}
              onClick={handleUseLocation}
              title="My location"
            >
              <LocationIcon size={22} color="#d3914b" />
              My location
            </button>
          )}
        </div>
      </div>
      {/* Фиксированный нижний блок для мобильных: фильтры+счетчик справа, под ними карточки кофеен */}
      {isMobileView && (
        <div style={styles.mobileBottomBarFixed}>
          <div style={styles.mobileFiltersRowFixed}>
            <button
              style={styles.mobileGeoButton}
              onClick={handleUseLocation}
              title="Моё местоположение"
            >
              <LocationIcon size={20} color="#d3914b" />
            </button>
            <span style={styles.coffeeCount}>{filteredShops.length} found</span>
            <button
              style={styles.fabFilterBottom}
              onClick={() => setIsFilterModalOpen(true)}
            >
              <span role="img" aria-label="filter">🔎</span> Filters
            </button>
          </div>
          <div style={styles.mobileListScrollFixed}>
            <CoffeeList
              coffeeShops={filteredShops}
              onShopClick={handleShopClick}
              horizontal
              showCount={false}
            />
          </div>
          <div style={styles.mobileSliderContainer}>
            <div style={styles.mobileSliderWrapper}>
              <label htmlFor="radius-slider-mobile" style={{ fontWeight: 500, fontSize: '1rem', color: '#d3914b', display: 'block', marginBottom: 6 }}>
                Search radius: {feetOptions[radiusIdx]} ft
              </label>
              <input
                id="radius-slider-mobile"
                type="range"
                min={0}
                max={feetOptions.length - 1}
                value={radiusIdx}
                onChange={e => setRadiusIdx(Number(e.target.value))}
                style={sliderStyle}
                className="radius-slider"
              />
            </div>
          </div>
        </div>
      )}
      {/* Мобильная панель управления */}
      {isMobileView && (
        <div style={styles.mobileControls}>
          <button
            style={{
              ...styles.mobileButton,
              ...(activeView === 'map' && styles.mobileButtonActive)
            }}
            onClick={() => {
              setActiveView('map');
              setShowSidebar(false);
            }}
          >
            <span role="img" aria-label="map">🗺️</span>
            <span>Map</span>
          </button>
          <button
            style={{
              ...styles.mobileButton,
              ...(activeView === 'list' && styles.mobileButtonActive)
            }}
            onClick={() => {
              setActiveView('list');
              setShowSidebar(true);
            }}
          >
            <span role="img" aria-label="list">📋</span>
            <span>List</span>
          </button>
        </div>
      )}
      {/* Модальное окно фильтров */}
      {isFilterModalOpen && (
        <Modal onClose={() => setIsFilterModalOpen(false)}>
          <FilterPanel filters={filters} setFilters={setFilters} />
          <button style={styles.closeModalBtn} onClick={() => setIsFilterModalOpen(false)}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default Home;