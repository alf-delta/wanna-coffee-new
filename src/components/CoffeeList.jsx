import React from 'react';
import PropTypes from 'prop-types';

const CoffeeList = ({ coffeeShops = [], onShopClick, horizontal = false, showCount = true }) => {
  console.log('CoffeeList received shops:', coffeeShops.length);
  
  if (!coffeeShops || coffeeShops.length === 0) {
    return (
      <div style={horizontal ? styles.emptyStateHorizontal : styles.emptyState}>
        No coffee shops found in this area
      </div>
    );
  }

  return (
    <div style={horizontal ? styles.horizontalList : styles.container}>
      {showCount && !horizontal && <h3 style={styles.title}>Coffee Shops ({coffeeShops.length})</h3>}
      <div style={horizontal ? styles.horizontalCards : styles.list}>
        {coffeeShops.map((shop) => (
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
                <img src="/src/assets/google-maps-pin.svg" alt="Google Maps" width={20} height={20} />
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
