import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useAccount } from '../context/AccountContext';
import CoffeeMap from '../components/CoffeeMap';
import { CustomCheckbox } from '../components/FilterPanel';
import CoffeeList from '../components/CoffeeList';
import { fetchCoffeeShops } from '../utils/coffeeShops';
import * as turf from '@turf/turf';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';

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
    gap: 0,
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

// Стили для белого текста в подзаголовках волн
const waveSubTitleStyle = { color: '#e0dbd7', fontWeight: 500, fontSize: '1em', margin: 0 };

const waveTitleStyle = { fontWeight: 700, margin: '10px 0 0 0', color: '#222' };

const Home = () => {
  const [coffeeShopsData, setCoffeeShopsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [radiusIdx, setRadiusIdx] = useState(0); // минимальный радиус по умолчанию
  const [mapCenter, setMapCenter] = useState([-74.009, 40.707]); // Financial District, Manhattan
  const [filters, setFilters] = useState({ openNow: false });
  const { settings, setSettings, favorites } = useAccount();
  const [selectedShop, setSelectedShop] = useState(null);
  const [hoveredShopId, setHoveredShopId] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeView, setActiveView] = useState('map'); // 'map' или 'list'
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showWaveInfo, setShowWaveInfo] = useState(false);
  const [searchMobileOpen, setSearchMobileOpen] = useState(false);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const filterBtnRef = useRef(null);
  const filterPopoverRef = useRef(null);

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

  // Фильтрация кофеен по радиусу, 'Open now' и режиму Saved/Others
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
        const mode = settings?.favoritesFilter || 'all';
        const isFav = favorites?.shops?.some?.(id => String(id) === String(shop.id));
        if (mode === 'saved') return !!isFav;
        if (mode === 'not_saved') return !isFav;
        return true;
      })
      // favorites filter applied inside CoffeeMap rendering; we keep list unchanged here
      .sort((a, b) => a.distance - b.distance);
  }, [coffeeShopsData, visualCenter, radiusCircle, filters, settings, favorites]);

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
  // Инициализируем только openNow из URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const openNow = params.get('openNow');
    setFilters(prev => ({ ...prev, openNow: openNow === 'true' }));
    // eslint-disable-next-line
  }, []);

  // 2. Сериализуем openNow и favoritesFilter в URL (для шаринга состояния)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.openNow) params.set('openNow', 'true');
    if (settings?.favoritesFilter && settings.favoritesFilter !== 'all') {
      params.set('favorites', settings.favoritesFilter);
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters, settings]);

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

  // Функция для выбора кофейни из поиска
  const handleSearchSelect = (shop) => {
    setSelectedShop(shop);
    if (mapRef.current && mapRef.current.flyTo) {
      mapRef.current.flyTo([shop.longitude, shop.latitude], 16);
    }
    setSearchMobileOpen(false);
  };

  // Клик вне поповера закрывает его
  useEffect(() => {
    if (!isFilterPopoverOpen) return;
    function handleClickOutside(e) {
      if (
        filterPopoverRef.current &&
        !filterPopoverRef.current.contains(e.target) &&
        filterBtnRef.current &&
        !filterBtnRef.current.contains(e.target)
      ) {
        setIsFilterPopoverOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterPopoverOpen]);

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
                ref={filterBtnRef}
                style={styles.fabFilterDesktop}
                onClick={() => setIsFilterPopoverOpen(v => !v)}
              >
                <span role="img" aria-label="filter">🔎</span> Filters
              </button>
              {/* Поповер фильтров */}
              {isFilterPopoverOpen && (
                <>
                  {/* Overlay */}
                  <div
                    onClick={() => setIsFilterPopoverOpen(false)}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100vw',
                      height: '100vh',
                      background: 'rgba(30,24,10,0.08)',
                      zIndex: 2001,
                      transition: 'background 0.2s',
                    }}
                  />
                  {/* Панель фильтров */}
                  <div
                    ref={filterPopoverRef}
                    style={{
                      position: 'absolute',
                      top: filterBtnRef.current ? (filterBtnRef.current.getBoundingClientRect().bottom + window.scrollY + 6) : 60,
                      left: filterBtnRef.current ? (filterBtnRef.current.getBoundingClientRect().left + window.scrollX) : 60,
                      zIndex: 2002,
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(15px)',
                      WebkitBackdropFilter: 'blur(15px)',
                      border: '1px solid #d3914b',
                      borderRadius: 14,
                      boxShadow: '0 8px 32px 0 rgba(204,144,66,0.18), 0 0 0 2px rgba(255,255,255,0.18)',
                      padding: '10px 14px 8px 14px',
                      minWidth: 280,
                      maxWidth: 340,
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{ marginBottom: 8 }}>
                      <CustomCheckbox
                        id="filter-open-now"
                        checked={filters.openNow}
                        onChange={e => setFilters(f => ({ ...f, openNow: !f.openNow }))}
                        label={<span style={{ fontSize: '1.13em', fontWeight: 700, marginTop: 2 }}>Open now</span>}
                      />
                    </div>
                    <div style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 10,
                      padding: '8px 12px 8px 12px',
                      marginBottom: 4,
                      background: '#fafbfc',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: '1.05em', color: '#b87333', letterSpacing: 0.2 }}>
                          Favorites
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
                        <CustomCheckbox
                          id="favorites-saved-desktop"
                          checked={settings?.favoritesFilter === 'saved'}
                          onChange={() => setSettings(s => ({ ...s, favoritesFilter: s.favoritesFilter === 'saved' ? 'all' : 'saved' }))}
                          label={<span style={{ fontSize: '0.93em', whiteSpace: 'nowrap', lineHeight: 1 }}>Only saved</span>}
                        />
                        <CustomCheckbox
                          id="favorites-not-saved-desktop"
                          checked={settings?.favoritesFilter === 'not_saved'}
                          onChange={() => setSettings(s => ({ ...s, favoritesFilter: s.favoritesFilter === 'not_saved' ? 'all' : 'not_saved' }))}
                          label={<span style={{ fontSize: '0.93em', whiteSpace: 'nowrap', lineHeight: 1 }}>Only not saved</span>}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
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
            <div style={{ margin: '16px 0' }}>
              <SearchBar coffeeShops={coffeeShopsData} onSelect={handleSearchSelect} placeholder="Search for a coffee shop..." />
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
            {/* FLEX-КОНТЕЙНЕР ДЛЯ КНОПОК */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
                style={{
                  ...styles.mobileGeoButton,
                  border: 'none',
                  boxShadow: styles.mobileGeoButton.boxShadow,
                  background: '#fff',
                  width: 44,
                  height: 44,
                  padding: '8px 12px',
                  minWidth: 0,
                  minHeight: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 22,
                  marginRight: 2,
                }}
                onClick={() => setSearchMobileOpen(true)}
                title="Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="7" stroke="#b87333" strokeWidth="2" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#b87333" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button
                style={{ ...styles.mobileGeoButton, border: 'none', boxShadow: styles.mobileGeoButton.boxShadow, background: '#fff', width: 44, height: 44, padding: '8px 12px', minWidth: 0, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 22 }}
              onClick={handleUseLocation}
                title="My location"
            >
              <LocationIcon size={20} color="#d3914b" />
            </button>
            </div>
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
              padding: isMobileView ? '4px 8px 8px 8px' : '8px 16px',
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
                    label={<span style={{ fontSize: '1.13em', fontWeight: 700, marginTop: 2 }}>Open now</span>}
              />
          </div>
                <div style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 10,
                  padding: '10px 16px 10px 16px',
                  marginBottom: 6,
                  background: '#fafbfc',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: '1.05em', color: '#b87333', letterSpacing: 0.2 }}>
                      Favorites
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
                    <CustomCheckbox
                      key='mobile-fav-saved'
                      id='mobile-favorites-saved'
                      checked={settings?.favoritesFilter === 'saved'}
                      onChange={() => setSettings(s => ({ ...s, favoritesFilter: s.favoritesFilter === 'saved' ? 'all' : 'saved' }))}
                      label={<span style={{ fontSize: '0.93em', whiteSpace: 'nowrap', lineHeight: 1 }}>Only saved</span>}
                    />
                    <CustomCheckbox
                      key='mobile-fav-not'
                      id='mobile-favorites-not-saved'
                      checked={settings?.favoritesFilter === 'not_saved'}
                      onChange={() => setSettings(s => ({ ...s, favoritesFilter: s.favoritesFilter === 'not_saved' ? 'all' : 'not_saved' }))}
                      label={<span style={{ fontSize: '0.93em', whiteSpace: 'nowrap', lineHeight: 1 }}>Only not saved</span>}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 10 }}>
                  <CustomCheckbox
                    id="filter-open-now"
                    checked={filters.openNow}
                    onChange={e => setFilters(f => ({ ...f, openNow: !f.openNow }))}
                    label={<span style={{ fontSize: '1.13em', fontWeight: 700, marginTop: 2 }}>Open now</span>}
                  />
                </div>
                <div style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 10,
                  padding: '10px 16px 10px 16px',
                  marginBottom: 6,
                  background: '#fafbfc',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: '1.05em', color: '#b87333', letterSpacing: 0.2 }}>
                      Waves
                    </span>
                    <button
                      onClick={() => setShowWaveInfo(true)}
                      style={{
                        width: 15,
                        height: 15,
                        minWidth: 0,
                        minHeight: 0,
                        borderRadius: '50%',
                        background: 'rgba(220,220,220,0.7)',
                        color: '#666',
                        border: '1px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 11,
                        lineHeight: 1,
                        marginLeft: 2,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                        cursor: 'pointer',
                        transition: 'background 0.18s',
                        outline: 'none',
                        padding: 0,
                        boxSizing: 'border-box',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(200,200,200,0.95)'}
                      onMouseOut={e => e.currentTarget.style.background = 'rgba(220,220,220,0.7)'}
                      aria-label="What are waves?"
                    >
                      ?
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
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
                        label={<span style={{ fontSize: '0.93em', whiteSpace: 'nowrap', lineHeight: 1 }}>{opt.label}</span>}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
      {/* Модальный поиск на мобильном */}
      {searchMobileOpen && (
        <div className="mobile-search-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(40,30,10,0.22)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 32 }} onClick={() => setSearchMobileOpen(false)}>
          <div style={{ width: '96%', maxWidth: 420, margin: '0 auto', background: 'rgba(255,255,255,0.98)', borderRadius: 18, boxShadow: '0 8px 32px rgba(204,144,66,0.13)', padding: '18px 10px 10px 10px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <SearchBar coffeeShops={coffeeShopsData} onSelect={handleSearchSelect} placeholder="Search for a coffee shop..." />
            <button onClick={() => setSearchMobileOpen(false)} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', fontSize: 22, color: '#b87333', cursor: 'pointer' }}>×</button>
          </div>
        </div>
      )}
      {/* Модальное окно с аннотацией по волнам */}
      {showWaveInfo && (
        <Modal onClose={() => setShowWaveInfo(false)}>
          <button
            onClick={() => setShowWaveInfo(false)}
            style={{
              position: 'absolute',
              top: isMobileView ? 6 : 18,
              right: isMobileView ? 6 : 18,
              width: isMobileView ? 22 : 28,
              height: isMobileView ? 22 : 28,
              minWidth: 0,
              minHeight: 0,
              boxSizing: 'border-box',
              padding: 0,
              margin: 0,
              lineHeight: 1,
              fontSize: isMobileView ? 15 : 18,
              fontFamily: 'inherit',
              outline: 'none',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.5) 100%)',
              color: '#666',
              border: '1.2px solid rgba(224,224,224,0.7)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              transition: 'all 0.2s ease'
            }}
            aria-label="Close"
          >
            ×
          </button>
          <div
            style={{
              padding: isMobileView ? '10px 6px 6px 6px' : '18px 18px 10px 18px',
              maxWidth: isMobileView ? '96vw' : 340,
              fontSize: isMobileView ? '0.97em' : '1em',
              position: 'relative',
            }}>
            <h3 style={{
              margin: isMobileView ? '0 0 10px 0' : '0 0 18px 0',
              fontWeight: 800,
              fontSize: isMobileView ? '1.18em' : '1.5em',
              color: '#e0dbd7',
              letterSpacing: 0.1,
              textAlign: 'center',
            }}>
              Coffee shop style
            </h3>
            <div>
              <b>Discover cafés that suit your taste.</b>
              <div style={{ color: '#e0dbd7', fontWeight: 400, margin: '6px 0 16px 0' }}>
                Each "wave" reflects a unique approach to coffee—from cozy familiarity to craft-driven precision.
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e0dbd7', opacity: 0.5, margin: '12px 0' }} />
              <div style={waveTitleStyle}>Second Wave</div>
              <div style={waveSubTitleStyle}>The Experience & The Brand</div>
              <div style={{ margin: '6px 0 16px 0' }}>
                These cafés turned coffee into a lifestyle. Think lattes, cappuccinos, and a warm, reliable vibe. Expect consistency, comfort, and rich blends that fit right into your daily rhythm.
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e0dbd7', opacity: 0.5, margin: '12px 0' }} />
              <div style={waveTitleStyle}>Third Wave</div>
              <div style={waveSubTitleStyle}>The Craft & The Origin</div>
              <div style={{ margin: '6px 0 16px 0' }}>
                Here, coffee is treated like fine wine. Every detail matters—from farm and roast to brewing. Baristas highlight flavor nuances using methods like pour-over, revealing bright citrus, florals, or fruit notes.
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e0dbd7', opacity: 0.5, margin: '12px 0' }} />
              <div style={waveTitleStyle}>Not Defined</div>
              <div style={waveSubTitleStyle}>Awaiting Classification</div>
              <div style={{ margin: '6px 0 0 0' }}>
                These up-and-coming spots show promise, but we're still gathering details. They may be hidden gems—stay tuned as we learn more.
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;