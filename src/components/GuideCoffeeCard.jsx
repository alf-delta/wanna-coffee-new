import React from 'react';
import './GuideCoffeeCard.css';
import WcImpressionLogo from '../assets/WC_IMPRESSION.svg';

const GuideCoffeeCard = ({ coffeeShop, onClose, showTierBadge = true, compact = false }) => {
  if (!coffeeShop) return null;

  const {
    name,
    address,
    description,
    descriptionBlocks,
    fact_check,
    workingHours,
    features = [],
    isOpen,
  } = coffeeShop;

  const getTierColor = (tier) => {
    switch (tier?.value) {
      case 'Tier 1': return '#4CAF50';
      case 'Tier 2': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getTierLabel = (tier) => {
    switch (tier?.value) {
      case 'Tier 1': return 'Premium';
      case 'Tier 2': return 'Quality';
      default: return 'Standard';
    }
  };

  const formatHours = (hours) => {
    if (!hours) return 'Hours not available';
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map((day, index) => {
      const dayHours = hours[day];
      if (!dayHours) return null;
      const isWeekend = day === 'saturday' || day === 'sunday';
      return (
        <div key={day} className="hours-row">
          <span className={`day ${isWeekend ? 'weekend' : ''}`}>{dayNames[index]}</span>
          <span className="time">{dayHours}</span>
        </div>
      );
    }).filter(Boolean);
  };

  if (compact) {
    return (
      <div className="guide-coffee-card compact">
        <div className="card-header compact-header">
          <div className="header-content compact-content">
            <h2 className="shop-name">{name}</h2>
            <p className="shop-address">{address}</p>
          </div>
        </div>
        <div className="card-content compact-content-row" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div className={`open-status ${isOpen === false ? 'closed' : 'open'}`}>{isOpen === false ? 'Closed' : 'Open'}</div>
          </div>
          <button className="route-btn" onClick={() => {
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address)}`;
            window.open(url, '_blank');
          }}>
            <span className="route-pin-icon" style={{display: 'flex', alignItems: 'center', marginRight: 6}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                <circle cx="12" cy="9" r="2.5" fill="#fff"/>
              </svg>
            </span>
            Route
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-coffee-card">
      <div className="card-header">
        <div className="header-content">
          <h2 className="shop-name">{name}</h2>
          <p className="shop-address">{address}</p>
          {showTierBadge && (
            <div className="tier-badge" style={{ backgroundColor: getTierColor(fact_check?.tier) }}>
              {getTierLabel(fact_check?.tier)}
            </div>
          )}
        </div>
        {onClose && <button className="close-button" onClick={onClose}>×</button>}
      </div>

      <div className="card-content">
        {/* Location & Atmosphere */}
        {descriptionBlocks?.['Location & Atmosphere'] && (
          <div className="guide-section">
            <div className="section-header">
              <div className="section-icon">📍</div>
              <h3>Location & Atmosphere</h3>
            </div>
            <p>{descriptionBlocks['Location & Atmosphere']}</p>
          </div>
        )}

        {/* Philosophy & Sourcing */}
        {descriptionBlocks?.['Philosophy & Sourcing'] && (
          <div className="guide-section">
            <div className="section-header">
              <div className="section-icon">🌱</div>
              <h3>Philosophy & Sourcing</h3>
            </div>
            <p>{descriptionBlocks['Philosophy & Sourcing']}</p>
          </div>
        )}

        {/* Equipment & Technique */}
        {descriptionBlocks?.['Equipment & Technique'] && (
          <div className="guide-section">
            <div className="section-header">
              <div className="section-icon">⚙️</div>
              <h3>Equipment & Technique</h3>
            </div>
            <p>{descriptionBlocks['Equipment & Technique']}</p>
          </div>
        )}

        {/* Recommendation */}
        {descriptionBlocks?.['Recommendation'] && (
          <div className="guide-section recommendation">
            <div className="section-header">
              <div className="section-icon">💡</div>
              <h3>Our Recommendation</h3>
            </div>
            <p>{descriptionBlocks['Recommendation']}</p>
          </div>
        )}

        {/* Working Hours */}
        <div className="guide-section">
          <div className="section-header">
            <div className="section-icon">🕒</div>
            <h3>Working Hours</h3>
          </div>
          <div className="hours-container">
            {formatHours(workingHours)}
          </div>
        </div>

        {/* Wanna Coffee Impression Logo */}
        {fact_check && (
          <div className="impression-logo-section">
            <div className="logo-container">
              <img src={WcImpressionLogo} alt="Wanna Coffee Impression" className="impression-logo" />
              <div className="logo-text">
                <p className="ai-description">
                  Wanna Coffee Impression is an AI that has gathered all available information from the web and transformed it into a mini-guide. While we cannot guarantee 100% accuracy, we have tried our very best to provide you with the most reliable and comprehensive information.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideCoffeeCard; 