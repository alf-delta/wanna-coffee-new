import React from 'react';
import PropTypes from 'prop-types';

const CoffeeList = ({ coffeeShops = [], onShopClick }) => {
  console.log('CoffeeList received shops:', coffeeShops.length);
  
  if (!coffeeShops || coffeeShops.length === 0) {
    return (
      <div style={styles.emptyState}>
        No coffee shops found in this area
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Coffee Shops ({coffeeShops.length})</h3>
      <div style={styles.list}>
        {coffeeShops.map((shop) => (
          <div 
            key={shop.id} 
            className="coffee-card"
            onClick={() => onShopClick(shop.id)}
            style={{ ...styles.card, cursor: 'pointer' }}
          >
            <h4 style={styles.name}>{shop.name}</h4>
            <p style={styles.address}>{shop.address}</p>
            <div style={styles.features}>
              {shop.features.map((feature, index) => (
                <span key={index} style={styles.feature}>
                  {feature.charAt(0).toUpperCase() + feature.slice(1).replace(/([A-Z])/g, ' $1')}
                </span>
              ))}
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`;
                window.open(url, '_blank');
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, border: '1px solid #eee', background: '#fff', cursor: 'pointer', marginTop: 8 }}
              title="Open in Google Maps"
            >
              <span role="img" aria-label="walk">🚶‍♂️</span>
              <span style={{ fontWeight: 'bold', fontSize: 18 }}>→</span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
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
  },
  title: {
    margin: '0 0 1rem 0',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    overflowY: 'auto',
    paddingRight: '0.5rem',
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
  },
  name: {
    margin: '0 0 0.25rem 0',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#212529',
  },
  address: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.875rem',
    color: '#6c757d',
  },
  features: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  feature: {
    backgroundColor: '#e9ecef',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    color: '#495057',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6c757d',
    fontSize: '0.875rem',
  },
};

CoffeeList.propTypes = {
  coffeeShops: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      features: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  onShopClick: PropTypes.func.isRequired,
};

export default CoffeeList;
