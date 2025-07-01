import React from 'react';
import PropTypes from 'prop-types';
import * as turf from '@turf/turf';

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

  return (
    <div style={horizontal ? styles.horizontalList : styles.container}>
      {showCount && !horizontal && <h3 style={styles.title}>Coffee Shops ({coffeeShops.length})</h3>}
      <div style={horizontal ? styles.horizontalCards : styles.list}>
        {filteredShops.map((shop) => (
          <div 
            key={shop.id} 
            className="coffee-card"
            onClick={() => onShopClick(shop.id)}
            style={{ 
              ...styles.card, 
              ...(horizontal ? styles.cardHorizontal : {}), 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 170, // можно скорректировать под нужную высоту
            }}
          >
            <h4 style={styles.name}>{shop.name}</h4>
            <p style={styles.address}>{shop.address}</p>
            {shop.hours && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 2px 0' }}>
                <span style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: isOpenNow(shop.hours) === null ? '#ccc' : isOpenNow(shop.hours) ? '#28a745' : '#dc3545',
                }}></span>
                <span style={{
                  fontSize: '0.8rem',
                  color: isOpenNow(shop.hours) === null ? '#6c757d' : isOpenNow(shop.hours) ? '#28a745' : '#dc3545',
                  fontWeight: 500,
                }}>
                  {isOpenNow(shop.hours) === null ? 'Hours not specified' : isOpenNow(shop.hours) ? 'Open' : 'Closed'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                  {shop.hours}
                </span>
              </div>
            )}
            <button
              onClick={e => {
                e.stopPropagation();
                const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`;
                window.open(url, '_blank');
              }}
              style={{
                background: '#d3914b',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14,
                width: '100%',
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 2px 8px rgba(211,145,75,0.08)',
                transition: 'background 0.2s',
                '@media (max-width: 768px)': {
                  padding: '10px 8px',
                  fontSize: 15,
                  marginTop: 6,
                },
              }}
              title="Маршрут в Google Maps"
            >
              🚶‍♂️ Route
            </button>
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
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    })
  ).isRequired,
  onShopClick: PropTypes.func.isRequired,
};

export default CoffeeList;
