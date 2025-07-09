import React, { useState, useEffect } from 'react';
import GuideCoffeeCard from '../components/GuideCoffeeCard.jsx';
import WcImpressionLogo from '../assets/WC_IMPRESSION.svg';
import './GuideDemo.css';

// Функция для определения открыто/закрыто
function isOpenNow(workingHours) {
  if (!workingHours) return null;
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const now = new Date();
  const today = days[now.getDay()];
  const hours = workingHours[today];
  if (!hours) return null;
  const [start, end] = hours.split('-');
  if (!start || !end) return null;
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const startDate = new Date(now);
  startDate.setHours(startH, startM, 0, 0);
  const endDate = new Date(now);
  endDate.setHours(endH, endM, 0, 0);
  if (endDate <= startDate) endDate.setDate(endDate.getDate() + 1); // ночные
  return now >= startDate && now <= endDate;
}

const GuideDemo = () => {
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuideCoffeeShops = async () => {
      try {
        const response = await fetch('/guideCoffeeShops.json');
        const data = await response.json();
        setCoffeeShops(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading guide coffee shops:', error);
        setLoading(false);
      }
    };

    loadGuideCoffeeShops();
  }, []);

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
  };

  const handleCloseCard = () => {
    setSelectedShop(null);
  };

  if (loading) {
    return (
      <div className="guide-demo">
        <div className="loading">Loading guide coffee shops...</div>
      </div>
    );
  }

  return (
    <div className="guide-demo">
      <div className="demo-header">
        <h1>Guide Coffee Card Demo</h1>
        <p>Click on any coffee shop to see the new guide-style card</p>
      </div>

      <div className="shops-grid">
        {coffeeShops.slice(0, 12).map((shop) => (
          <div
            key={shop.id}
            className="shop-preview"
            onClick={() => handleShopSelect(shop)}
          >
            <div className="preview-header">
              <h3>{shop.name}</h3>
              <div className="preview-tier">
                {shop.fact_check?.tier?.value || 'Standard'}
              </div>
            </div>
            <p className="preview-address">{shop.address}</p>
            <div className="preview-sections-row">
              <div className="preview-sections-left">
                {shop.descriptionBlocks && Object.keys(shop.descriptionBlocks).length > 0 && (
                  <img src={WcImpressionLogo} alt="WC Impression" className="preview-impression-logo" />
                )}
              </div>
              <div className="preview-sections-right">
                {shop.workingHours && (
                  <span className={`open-indicator ${isOpenNow(shop.workingHours) ? 'open' : 'closed'}`}>
                    {isOpenNow(shop.workingHours) ? 'Open now' : 'Closed'}
                  </span>
                )}
                <a
                  className="gmaps-btn"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in Google Maps"
                  onClick={e => e.stopPropagation()}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H13.5" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 3H21V7" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 14L21 3" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedShop && (
        <div className="modal-overlay" onClick={handleCloseCard}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            {/* Кнопка закрытия вне карточки */}
            <button
              onClick={handleCloseCard}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '28px',
                height: '28px',
                minWidth: '0',
                minHeight: '0',
                boxSizing: 'border-box',
                padding: 0,
                margin: 0,
                lineHeight: '1',
                fontSize: '18px',
                fontFamily: 'inherit',
                outline: 'none',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.5) 100%)',
                color: '#666',
                border: '1.2px solid rgba(224, 224, 224, 0.7)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
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
              onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.75) 100%)'}
              onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.5) 100%)'}
              aria-label="Закрыть"
            >
              ×
            </button>
            <GuideCoffeeCard 
              coffeeShop={selectedShop} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideDemo; 