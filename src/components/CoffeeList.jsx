import React from 'react';
import PropTypes from 'prop-types';
import * as turf from '@turf/turf';
import WcImpressionLogo from '../assets/WC_IMPRESSION.svg';
import GuideCoffeeCard from './GuideCoffeeCard';

const CoffeeList = ({ coffeeShops = [], onShopClick, onShopHover, onShopLeave, hoveredShopId = null, horizontal = false, showCount = true, center, radiusCircle }) => {
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
            style={{ 
              marginBottom: 8, 
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out',
              transform: hoveredShopId === shop.id ? 'scale(1.02)' : 'scale(1)'
            }}
            onClick={() => onShopClick(shop)}
            onMouseEnter={() => onShopHover && onShopHover(shop.id)}
            onMouseLeave={() => onShopLeave && onShopLeave()}
          >
            <GuideCoffeeCard coffeeShop={shop} showTierBadge={false} compact={true} />
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
    gap: '0.25rem',
    overflowY: 'auto',
    paddingRight: '0.25rem',
    '@media (max-width: 768px)': {
      gap: '0.1875rem',
      paddingRight: '0',
    },
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: '0.625rem',
    borderRadius: '4px',
    border: '1px solid #e9ecef',
    marginBottom: 0,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '@media (max-width: 768px)': {
      padding: '0.5rem',
      borderRadius: '3px',
      marginBottom: 0,
    },
    ':hover': {
      backgroundColor: '#e9ecef',
      transform: 'translateY(-1px)',
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
  hours: {
    margin: '0 0 0.375rem 0',
    fontSize: '0.75rem',
    '@media (max-width: 768px)': {
      fontSize: '0.7rem',
      margin: '0 0 0.25rem 0',
    },
  },
  openIndicator: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  closedIndicator: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  hoursText: {
    color: '#6c757d',
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
    backgroundColor: '#f8f9fa',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #e9ecef',
    minWidth: '200px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '@media (max-width: 768px)': {
      padding: '0.375rem',
      borderRadius: '3px',
      minWidth: '180px',
    },
    ':hover': {
      backgroundColor: '#e9ecef',
      transform: 'translateY(-1px)',
    },
  },
  emptyStateHorizontal: {
    textAlign: 'center',
    padding: '1rem',
    color: '#6c757d',
    fontSize: '0.8rem',
    '@media (max-width: 768px)': {
      padding: '0.5rem',
      fontSize: '0.75rem',
    },
  },
};

CoffeeList.propTypes = {
  coffeeShops: PropTypes.array,
  onShopClick: PropTypes.func.isRequired,
  onShopHover: PropTypes.func,
  onShopLeave: PropTypes.func,
  hoveredShopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  horizontal: PropTypes.bool,
  showCount: PropTypes.bool,
  center: PropTypes.array,
  radiusCircle: PropTypes.number,
};

export default CoffeeList;
