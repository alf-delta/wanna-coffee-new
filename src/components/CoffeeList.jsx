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

  return (
    <div style={horizontal ? styles.horizontalList : styles.container}>
      {showCount && !horizontal && <h3 style={styles.title}>Coffee Shops ({coffeeShops.length})</h3>}
      <div style={horizontal ? styles.horizontalCards : styles.list}>
        {filteredShops.map((shop) => (
          <div 
            key={shop.id} 
            className="coffee-card"
            onClick={() => onShopClick(shop.id)}
            style={{ ...styles.card, ...(horizontal ? styles.cardHorizontal : {}), cursor: 'pointer' }}
          >
            <h4 style={styles.name}>{shop.name}</h4>
            <p style={styles.address}>{shop.address}</p>
            <button
              onClick={e => {
                e.stopPropagation();
                const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`;
                window.open(url, '_blank');
              }}
              style={styles.gmapsButton}
              title="Open in Google Maps"
            >
              <span role="img" aria-label="walk">🚶‍♂️</span>
              <span style={styles.arrow}>→</span>
              <span style={styles.gmapsIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                  <g>
                    <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.9 0 5.5 1 7.6 2.7l6-6C34.3 5.1 29.4 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"/>
                    <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c2.9 0 5.5 1 7.6 2.7l6-6C34.3 5.1 29.4 3 24 3 15.6 3 8.1 8.5 6.3 14.7z"/>
                    <path fill="#FBBC05" d="M24 43c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.5 34.9 26.9 36 24 36c-5.6 0-10.3-3.8-12-9l-6.6 5.1C8.1 39.5 15.6 45 24 45z"/>
                    <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-3.6 5.1-6.3 6.1l6.5 5.3C41.2 36.1 44 30.9 44 24c0-1.3-.1-2.7-.4-4z"/>
                  </g>
                </svg>
              </span>
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
