import React from 'react';
import PropTypes from 'prop-types';
import * as turf from '@turf/turf';
import WcImpressionLogo from '../assets/WC_IMPRESSION.svg';

const CoffeeList = ({ coffeeShops = [], onShopClick, horizontal = false, showCount = true, center, radiusCircle }) => {
  console.log('CoffeeList received shops:', coffeeShops.length);
  
  if (!coffeeShops || coffeeShops.length === 0) {
    return (
      <div style={horizontal ? styles.emptyStateHorizontal : styles.emptyState}>
        No coffee shops found in this area
      </div>
    );
  }

  // Функция фильтрации кофеен по радиусу (должна совпадать с CoffeeMap)
  function getShopsInRadius(center, radius, shops) {
    return shops.filter(shop => {
      if (isNaN(shop.longitude) || isNaN(shop.latitude)) return false;
      const from = turf.point(center);
      const to = turf.point([shop.longitude, shop.latitude]);
      const dist = turf.distance(from, to, { units: 'meters' });
      return dist <= radius;
    });
  }

  // Вместо старой фильтрации используем getShopsInRadius
  const filteredShops = getShopsInRadius(center, radiusCircle, coffeeShops);

  // Вспомогательная функция для проверки, открыта ли кофейня сейчас
  function isOpenNow(hoursStr) {
    if (!hoursStr) return null;
    
    try {
      // hoursStr: "07:00–20:00" или "08:00-20:00"
      const [open, close] = hoursStr.split(/[–-]/).map(s => s.trim());
      if (!open || !close) return null;
      
      const now = new Date();
      const pad = n => n.toString().padStart(2, '0');
      const nowStr = pad(now.getHours()) + ':' + pad(now.getMinutes());
      
      // Сравниваем строки вида "08:00" <= nowStr < "20:00"
      const isOpen = open <= nowStr && nowStr < close;
      
      // Отладочная информация
      if (Math.random() < 0.01) { // Показываем только 1% случаев для отладки
        console.log('Проверка часов:', { hoursStr, open, close, nowStr, isOpen });
      }
      
      return isOpen;
    } catch (error) {
      console.warn('Ошибка парсинга часов:', hoursStr, error);
      return null;
    }
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

  const cardPadding = isMobile ? '6px 8px 6px 8px' : '10px 12px 10px 12px';
  const nameMargin = isMobile ? '0 0 2px 0' : '0 0 4px 0';
  const addressMargin = isMobile ? '0 0 4px 0' : '0 0 6px 0';

  return (
    <div style={horizontal ? styles.horizontalList : styles.container}>
      {showCount && !horizontal && <h3 style={styles.title}>Coffee Shops ({coffeeShops.length})</h3>}
      <div style={horizontal ? styles.horizontalCards : styles.list}>
        {filteredShops.map((shop) => (
          <div 
            key={shop.id} 
            className="coffee-card"
            onClick={() => onShopClick(shop)}
            style={{ 
              ...styles.card, 
              ...(horizontal ? styles.cardHorizontal : {}), 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: isMobile ? 110 : 170,
              padding: cardPadding,
            }}
          >
            <div style={{ position: 'relative', width: '100%' }}>
              <span
                style={{
                  ...styles.name,
                  margin: nameMargin,
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  paddingRight: 32, // чтобы fade не перекрывал текст
                  position: 'relative',
                  maxWidth: '100%',
                }}
              >
                {shop.name}
              </span>
              <span
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  height: '100%',
                  width: 32,
                  pointerEvents: 'none',
                  background: 'linear-gradient(to right, rgba(255,255,255,0), #f8f9fa 80%)',
                  borderRadius: '0 4px 4px 0',
                }}
              />
            </div>
            <div style={{ position: 'relative', width: '100%' }}>
              <span
                style={{
                  ...styles.address,
                  margin: addressMargin,
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  paddingRight: 32,
                  position: 'relative',
                  maxWidth: '100%',
                }}
              >
                {shop.address}
              </span>
              <span
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  height: '100%',
                  width: 32,
                  pointerEvents: 'none',
                  background: 'linear-gradient(to right, rgba(255,255,255,0), #f8f9fa 80%)',
                  borderRadius: '0 4px 4px 0',
                }}
              />
            </div>
            {shop.hours && (
              <div style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
                <span style={{
                  fontSize: isMobile ? 12 : 13,
                  fontWeight: 600,
                  padding: isMobile ? '2px 8px' : '4px 12px',
                  borderRadius: 12,
                  background: isOpenNow(shop.hours) === null ? '#e9ecef' : isOpenNow(shop.hours) ? '#e6f9e6' : '#fbeaea',
                  color: isOpenNow(shop.hours) === null ? '#8B4513' : isOpenNow(shop.hours) ? '#219150' : '#c0392b',
                  border: '1px solid',
                  borderColor: isOpenNow(shop.hours) === null ? '#e0e0e0' : isOpenNow(shop.hours) ? '#b6eab6' : '#f5b7b1',
                  marginRight: 0,
                  letterSpacing: '0.5px',
                  minWidth: isMobile ? 0 : 60,
                  textAlign: 'center',
                }}>
                  {isOpenNow(shop.hours) === null ? 'Hours?' : isOpenNow(shop.hours) ? (isMobile ? 'Open' : 'Open now') : 'Closed'}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: isMobile ? 1 : 10, minHeight: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <img src={WcImpressionLogo} alt="WC Impression" style={{ height: isMobile ? 32 : 36, width: 'auto', marginLeft: 0, marginRight: 0, display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))' }} />
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`;
                  window.open(url, '_blank');
                }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#fff', border: '1px solid #e0e0e0', borderRadius: isMobile ? 6 : 8,
                  padding: 0,
                  cursor: 'pointer', marginLeft: 4,
                  transition: 'box-shadow 0.15s, border-color 0.15s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  width: isMobile ? 22 : 36,
                  height: isMobile ? 22 : 36,
                }}
                title="Open in Google Maps"
              >
                <svg width={isMobile ? 13 : 20} height={isMobile ? 13 : 20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H13.5" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 3H21V7" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14L21 3" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 0,
  },
  title: {
    margin: '0 0 0.75rem 0',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      margin: '0 0 0.5rem 0',
    },
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    overflowY: 'auto',
    paddingRight: '0.25rem',
    '@media (max-width: 768px)': {
      gap: '0.375rem',
      paddingRight: '0',
    },
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: '0.625rem',
    borderRadius: '4px',
    border: '1px solid #e9ecef',
    marginBottom: 0,
    '@media (max-width: 768px)': {
      padding: '0.5rem',
      borderRadius: '3px',
      marginBottom: 0,
    },
  },
  name: {
    margin: '0 0 0.25rem 0',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#212529',
    '@media (max-width: 768px)': {
      fontSize: '0.85rem',
    },
  },
  address: {
    margin: '0 0 0.375rem 0',
    fontSize: '0.8rem',
    color: '#6c757d',
    '@media (max-width: 768px)': {
      fontSize: '0.75rem',
      margin: '0 0 0.25rem 0',
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: '1.5rem',
    color: '#6c757d',
    fontSize: '0.8rem',
    '@media (max-width: 768px)': {
      padding: '0.75rem',
      fontSize: '0.75rem',
    },
  },
  gmapsButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    padding: '3px 6px',
    borderRadius: 4,
    border: '1px solid #eee',
    background: '#fff',
    cursor: 'pointer',
    marginTop: 6,
    '@media (max-width: 768px)': {
      padding: '4px 8px',
      marginTop: 4,
    },
  },
  arrow: {
    fontWeight: 'bold',
    fontSize: 16,
    '@media (max-width: 768px)': {
      fontSize: 14,
    },
  },
  gmapsIcon: {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      transform: 'scale(0.85)',
    },
  },
  horizontalList: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    overflowX: 'auto',
    alignItems: 'flex-start',
    background: 'none',
    padding: 0,
    marginBottom: 0,
  },
  horizontalCards: {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.75rem',
    width: '100%',
    overflowX: 'auto',
    padding: 0,
    marginBottom: 0,
  },
  cardHorizontal: {
    minWidth: 220,
    maxWidth: 260,
    flex: '0 0 auto',
    margin: 0,
    padding: '0.75rem 0.75rem 0.75rem 0.75rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    border: '1px solid #eee',
    borderRadius: 8,
    background: '#fff',
  },
  emptyStateHorizontal: {
    minWidth: 220,
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '0.8rem',
    padding: '1rem',
  },
};

CoffeeList.propTypes = {
  coffeeShops: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    })
  ).isRequired,
  onShopClick: PropTypes.func.isRequired,
};

export default CoffeeList;
