import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import CoffeeMap from '../components/CoffeeMap';
import FilterPanel, { CustomCheckbox } from '../components/FilterPanel';
import CoffeeList from '../components/CoffeeList';
import { fetchCoffeeShops } from '../utils/coffeeShops';
import * as turf from '@turf/turf';
import { filtersConfig } from '../filtersConfig';
import Modal from '../components/Modal';

const feetOptions = [750, 1500, 2500, 3500, 5000];

const styles = {
  home: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 88px)',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    minHeight: 0,
    height: 'calc(100vh - 88px)',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      height: '100%',
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
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    zIndex: 2,
    overflow: 'hidden',
    padding: '0.5rem',
    gap: '0.5rem',
    margin: '0 12px 12px 12px',
    height: '100%',
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
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      height: 'calc(100vh - 60px)',
    },
  },
  mapWrapper: {
    width: '100%',
    height: '100%',
    minHeight: 0,
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
    borderRadius: '8px',
    padding: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flex: 1,
    minHeight: 0,
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
    borderTop: '1px solid #fff',
    borderRadius: '0 0 16px 16px',
    paddingBottom: 22,
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
  borderRadius: '8px',
  background: '#bfae9c',
  outline: 'none',
  margin: '0',
  marginBottom: '0',
};

// Глобальные стили для кастомного слайдера (только для input[type=range])
if (typeof document !== 'undefined' && !document.getElementById('custom-slider-style')) {
  const style = document.createElement('style');
  style.id = 'custom-slider-style';
  style.textContent = `
    input[type=range]::-webkit-slider-runnable-track {
      height: 4px;
      background: #bfae9c;
      border-radius: 8px;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: #d3914b;
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.10);
      border: 2px solid #fff;
      margin-top: -8px;
      transition: box-shadow 0.2s;
    }
    input[type=range]:focus::-webkit-slider-thumb {
      box-shadow: 0 0 0 3px #e7d3b7;
    }
    input[type=range]::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: #d3914b;
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.10);
      border: 2px solid #fff;
      transition: box-shadow 0.2s;
    }
    input[type=range]:focus::-moz-range-thumb {
      box-shadow: 0 0 0 3px #e7d3b7;
    }
    input[type=range]::-ms-fill-lower,
    input[type=range]::-ms-fill-upper {
      background: #bfae9c;
      border-radius: 8px;
    }
    input[type=range]::-ms-thumb {
      width: 20px;
      height: 20px;
      background: #d3914b;
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.10);
      border: 2px solid #fff;
      transition: box-shadow 0.2s;
    }
    input[type=range]:focus::-ms-thumb {
      box-shadow: 0 0 0 3px #e7d3b7;
    }
    input[type=range] {
      outline: none;
    }
  `;
  document.head.appendChild(style);
}

// Кастомные стили для горизонтального скроллбара карточек
if (typeof document !== 'undefined' && !document.getElementById('custom-scrollbar-style')) {
  const style = document.createElement('style');
  style.id = 'custom-scrollbar-style';
  style.textContent = `
    .mobileListScrollFixed::-webkit-scrollbar {
      height: 6px;
      background: #f5f1ec;
      border-radius: 6px;
    }
    .mobileListScrollFixed::-webkit-scrollbar-thumb {
      background: #bfae9c;
      border-radius: 6px;
    }
    .mobileListScrollFixed {
      scrollbar-width: thin;
      scrollbar-color: #bfae9c #f5f1ec;
    }
  `;
  document.head.appendChild(style);
}

const waveInfoText = (
  <div style={{ fontSize: '0.97em', color: '#333', lineHeight: 1.5 }}>
    <div style={{ marginBottom: 10 }}>
      <b>Discover cafés that suit your taste.</b><br/>
      Each "wave" reflects a unique approach to coffee—from cozy familiarity to craft-driven precision.
    </div>
    <div style={{ borderTop: '1px solid #eee', margin: '12px 0' }} />
    <div style={{ marginBottom: 8 }}>
      <b>Second Wave</b><br/>
      <span style={{ color: '#888', fontSize: '0.97em' }}>The Experience & The Brand</span><br/>
      These cafés turned coffee into a lifestyle. Think lattes, cappuccinos, and a warm, reliable vibe. Expect consistency, comfort, and rich blends that fit right into your daily rhythm.
    </div>
    <div style={{ borderTop: '1px solid #eee', margin: '12px 0' }} />
    <div style={{ marginBottom: 8 }}>
      <b>Third Wave</b><br/>
      <span style={{ color: '#888', fontSize: '0.97em' }}>The Craft & The Origin</span><br/>
      Here, coffee is treated like fine wine. Every detail matters—from farm and roast to brewing. Baristas highlight flavor nuances using methods like pour-over, revealing bright citrus, florals, or fruit notes.
    </div>
    <div style={{ borderTop: '1px solid #eee', margin: '12px 0' }} />
    <div>
      <b>Not Defined</b><br/>
      <span style={{ color: '#888', fontSize: '0.97em' }}>Awaiting Classification</span><br/>
      These up-and-coming spots show promise, but we're still gathering details. They may be hidden gems—stay tuned as we learn more.
    </div>
  </div>
);

const Home = () => {
  const [coffeeShopsData, setCoffeeShopsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [radiusIdx, setRadiusIdx] = useState(0); // минимальный радиус по умолчанию
  const [mapCenter, setMapCenter] = useState([-74.009, 40.707]); // Financial District, Manhattan
  const [filters, setFilters] = useState({ openNow: false, wave: [] });
  const [selectedShop, setSelectedShop] = useState(null);
  const [hoveredShopId, setHoveredShopId] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeView, setActiveView] = useState('map'); // 'map' или 'list'
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showWaveInfo, setShowWaveInfo] = useState(false);

  const mapRef = useRef(null);

  // feetOptions[radiusIdx] — радиус в футах, переводим в метры для карты
  const radiusCircle = feetOptions[radiusIdx] / 3.28084;

  // Получаем смещённый центр для мобильных
  const getVisualCenter = () => {
    if (mapRef.current && typeof window !== 'undefined' && window.innerWidth <= 768) {
      return mapRef.current.getVisualCenter ? mapRef.current.getVisualCenter(180) : mapCenter;
    }
    return mapCenter;
  };
  const visualCenter = getVisualCenter();

  // Загрузка данных кофеен
  useEffect(() => {
    const loadCoffeeShops = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchCoffeeShops();
        console.log('Home: Загружено кофеен:', data.length);
        setCoffeeShopsData(data);
      } catch (err) {
        console.error('Ошибка загрузки кофеен:', err);
        setError('Не удалось загрузить данные кофеен');
      } finally {
        setIsLoading(false);
      }
    };

    loadCoffeeShops();
  }, []);

  // Фильтрация кофеен по радиусу и фильтру 'Open now'
  const filteredShops = useMemo(() => {
    if (!coffeeShopsData || coffeeShopsData.length === 0) {
      return [];
    }
    return coffeeShopsData
      .map(shop => {
        const shopCoords = [shop.longitude, shop.latitude];
        const centerPoint = turf.point(visualCenter);
        const shopPoint = turf.point(shopCoords);
        const distance = turf.distance(centerPoint, shopPoint, { units: 'meters' });
        return { ...shop, distance };
      })
      .filter(shop => shop.distance <= radiusCircle)
      .filter(shop => {
        if (filters.openNow) {
          // Проверяем, открыта ли кофейня сейчас
          if (!shop.hours) return false;
          const [open, close] = shop.hours.split(/[–—-]/).map(s => s.trim());
          if (!open || !close) return false;
          const now = new Date();
          const pad = n => n.toString().padStart(2, '0');
          const nowStr = pad(now.getHours()) + ':' + pad(now.getMinutes());
          return open <= nowStr && nowStr < close;
        }
        return true;
      })
      .filter(shop => {
        // Wave filter
        if (filters.wave && Array.isArray(filters.wave) && filters.wave.length > 0) {
          const shopWave = shop.wave || shop.ai_classification?.wave;
          if (!shopWave) return false;
          return filters.wave.includes(shopWave);
        }
        return true;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [coffeeShopsData, visualCenter, radiusCircle, filters]);

  const handleShopClick = useCallback((shop) => {
    setSelectedShop(shop);
  }, []);

  const handleShopHover = useCallback((shopId) => {
    setHoveredShopId(shopId);
  }, []);

  const handleShopLeave = useCallback(() => {
    setHoveredShopId(null);
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
    // Read openNow from URL
    const openNow = params.get('openNow');
    newFilters.openNow = openNow === 'true';
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
    // Add openNow to URL
    if (filters.openNow) {
      params.set('openNow', 'true');
    }
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

  useEffect(() => {
    if (filteredShops && filteredShops.length > 0) {
      console.log('[DEBUG] filteredShops ids:', filteredShops.map(s => s.id), 'types:', filteredShops.map(s => typeof s.id));
    }
  }, [filteredShops]);

  useEffect(() => {
    console.log('[DEBUG] selectedShop:', selectedShop, 'type:', typeof selectedShop);
  }, [selectedShop]);

  const handleCloseSelectedShop = useCallback(() => {
    setSelectedShop(null);
  }, []);

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
              <label htmlFor="radius-slider" style={{ fontWeight: 500, fontSize: '1rem', color: '#d3914b', display: 'block', marginBottom: 0 }}>
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
                onShopHover={handleShopHover}
                onShopLeave={handleShopLeave}
                hoveredShopId={hoveredShopId}
                center={visualCenter}
                radiusCircle={radiusCircle}
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
              mapCenter={visualCenter}
              selectedShop={selectedShop}
              hoveredShopId={hoveredShopId}
              mobileOffsetY={-400}
              onCloseSelectedShop={handleCloseSelectedShop}
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
              style={styles.fabFilterBottom}
              onClick={() => setIsFilterModalOpen(true)}
            >
              <span role="img" aria-label="filter">🔎</span> Filters
            </button>
            <span style={styles.coffeeCount}>{filteredShops.length} found</span>
            <button
              style={styles.mobileGeoButton}
              onClick={handleUseLocation}
              title="Моё местоположение"
            >
              <LocationIcon size={20} color="#d3914b" />
            </button>
          </div>
          <div style={styles.mobileListScrollFixed}>
            <CoffeeList
              coffeeShops={filteredShops}
              onShopClick={handleShopClick}
              onShopHover={handleShopHover}
              onShopLeave={handleShopLeave}
              hoveredShopId={hoveredShopId}
              horizontal
              showCount={false}
              center={visualCenter}
              radiusCircle={radiusCircle}
            />
          </div>
          <div style={styles.mobileSliderContainer}>
            <div style={styles.mobileSliderWrapper}>
              <label htmlFor="radius-slider-mobile" style={{ fontWeight: 500, fontSize: '1rem', color: '#d3914b', display: 'block', marginBottom: 0 }}>
                Search radius: {feetOptions[radiusIdx]} ft
              </label>
              <input
                id="radius-slider-mobile"
                type="range"
                min={0}
                max={feetOptions.length - 1}
                value={radiusIdx}
                onChange={e => setRadiusIdx(Number(e.target.value))}
                style={{ ...sliderStyle, marginBottom: 0 }}
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
          <div
            style={{
              padding: isMobileView ? 8 : 16,
              maxHeight: isMobileView ? '70vh' : 'none',
              minWidth: isMobileView ? 0 : 340,
              overflowY: 'auto',
              boxSizing: 'border-box',
            }}
          >
            <h3 style={{ margin: isMobileView ? '0 0 10px 0' : '0 0 16px 0', fontSize: isMobileView ? '1.05rem' : '1.2rem', fontWeight: 600, color: '#333' }}>
              Filters
            </h3>
            {isMobileView ? (
              <>
                <div style={{ marginBottom: 10 }}>
                  <CustomCheckbox
                    id="filter-open-now"
                    checked={filters.openNow}
                    onChange={e => setFilters(f => ({ ...f, openNow: !f.openNow }))}
                    label={<span style={{ fontSize: '0.97em', marginTop: 2 }}>Open now</span>}
                  />
                </div>
                <div style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 10,
                  padding: '10px 8px 6px 8px',
                  marginBottom: 6,
                  background: '#fafbfc',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
                    {filtersConfig[0].options.map(opt => (
                      <CustomCheckbox
                        key={opt.value}
                        id={`filter-wave-${opt.value}`}
                        checked={Array.isArray(filters.wave) && filters.wave.includes(opt.value)}
                        onChange={() => {
                          const arr = Array.isArray(filters.wave) ? filters.wave : [];
                          setFilters(f => ({
                            ...f,
                            wave: arr.includes(opt.value)
                              ? arr.filter(v => v !== opt.value)
                              : [...arr, opt.value],
                          }));
                        }}
                        label={<span style={{ fontSize: '0.97em', marginTop: 2 }}>{opt.label}</span>}
                      />
                    ))}
                  </div>
                </div>
                {showWaveInfo && (
                  <Modal onClose={() => setShowWaveInfo(false)}>
                    <div style={{ padding: 18, maxWidth: 340, fontSize: '1em' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontWeight: 600, fontSize: '1.1em', color: '#333' }}>Coffee shop style</h3>
                      {waveInfoText}
                    </div>
                  </Modal>
                )}
              </>
            ) : (
              <>
                <FilterPanel filters={filters} setFilters={setFilters} />
                <div style={{ marginTop: 16 }}>
                  <CustomCheckbox
                    id="filter-open-now"
                    checked={filters.openNow}
                    onChange={e => setFilters(f => ({ ...f, openNow: !f.openNow }))}
                    label="Open now"
                  />
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;