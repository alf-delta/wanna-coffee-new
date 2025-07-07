import React from 'react';
import './GuideCoffeeCard.css';
import WcImpressionLogo from '../assets/WC_IMPRESSION.svg';

const GuideCoffeeCard = ({ coffeeShop, onClose }) => {
  if (!coffeeShop) return null;

  const {
    name,
    address,
    description,
    descriptionBlocks,
    fact_check,
    workingHours,
    features = []
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
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map((day, index) => {
      const dayHours = hours[day];
      if (!dayHours) return null;
      return (
        <div key={day} className="hours-row">
          <span className="day">{dayNames[index]}</span>
          <span className="time">{dayHours}</span>
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <div className="guide-coffee-card">
      <div className="card-header">
        <div className="header-content">
          <h2 className="shop-name">{name}</h2>
          <p className="shop-address">{address}</p>
          <div className="tier-badge" style={{ backgroundColor: getTierColor(fact_check?.tier) }}>
            {getTierLabel(fact_check?.tier)}
          </div>
        </div>
        <button className="close-button" onClick={onClose}>×</button>
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