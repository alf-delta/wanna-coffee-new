import React, { useState } from 'react';
import './GuideCoffeeCard.css';
import WcImpressionLogo from '../assets/WC_IMPRESSION.svg';
import BeansImage from '../assets/Beans.png';
import Modal from './Modal.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import { useAccount } from '../context/AccountContext';
import SuggestionModal from './SuggestionModal.jsx';

const GuideCoffeeCard = ({ coffeeShop, onClose, showTierBadge = true, compact = false }) => {
  const [showWaveInfo, setShowWaveInfo] = useState(false);
  
  if (!coffeeShop) return null;

  const {
    name,
    address,
    description,
    descriptionBlocks,
    workingHours,
    features = [],
    isOpen,
  } = coffeeShop;

  // Цвет для бейджа wave
  const getWaveColor = (wave) => {
    switch ((wave || '').toLowerCase()) {
      case '2nd wave': return '#3b82f6'; // синий
      case '3rd wave': return '#22c55e'; // зелёный
      default: return '#9E9E9E'; // серый
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

  const { addSuggestion, profile } = useAccount();
  const [suggestState, setSuggestState] = useState({ open: false, key: null });

  if (compact) {
    return (
      <div className="guide-coffee-card compact">
        <div className="card-header compact-header">
          <div className="header-content compact-content">
            <h2 className="shop-name">{name}</h2>
            <p className="shop-address">{address}</p>
          </div>
        </div>
        <div className="card-content compact-content-row" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
          <div className={`open-status ${isOpen === false ? 'closed' : 'open'}`}>{isOpen === false ? 'Closed' : 'Open'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="route-btn-compact"
              onClick={() => {
                const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address)}`;
                window.open(url, '_blank');
              }}
            >
              <span style={{display: 'flex', alignItems: 'center', marginRight: 4}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                  <circle cx="12" cy="9" r="2.5" fill="#fff"/>
                </svg>
              </span>
              Route
            </button>
          <FavoriteButton entityId={coffeeShop.id} type="shop" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-coffee-card">
      <div className="card-header">
        <div className="header-content" style={{ padding: '0 16px', paddingRight: '80px' }}>
          <h2 className="shop-name">{name}</h2>
          <p className="shop-address">{address}</p>
          {/* Кнопка Save в виде сердечка */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
            <FavoriteButton entityId={coffeeShop.id} type="shop" />
          </div>
        </div>
        {/* AI Guide бейдж */}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg, #cc9042 60%, #b87333 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.93rem',
            borderRadius: '12px',
            padding: '4px 14px',
            boxShadow: '0 2px 8px rgba(204,144,66,0.10)',
            letterSpacing: '0.5px',
            textShadow: '0 1px 2px rgba(0,0,0,0.07)',
          }}>AI Guide</span>
        </div>
      </div>

      <div className="card-content">
        {/* Location & Atmosphere */}
          {descriptionBlocks?.['Location & Atmosphere'] && (
          <div className="guide-section" style={{ position: 'relative', paddingBottom: 28 }}>
            <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="section-icon">📍</div>
                <h3 style={{ margin: 0 }}>Location & Atmosphere</h3>
              </div>
              {/* Кнопка Route справа */}
              <button
                className="route-btn-compact"
                onClick={() => {
                  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address)}`;
                  window.open(url, '_blank');
                }}
              >
                <span style={{display: 'flex', alignItems: 'center', marginRight: 4}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                    <circle cx="12" cy="9" r="2.5" fill="#fff"/>
                  </svg>
                </span>
                Route
              </button>
            </div>
            <p>{descriptionBlocks['Location & Atmosphere']}</p>
            <span
              role="button"
              tabIndex={0}
              style={{ position: 'absolute', right: 12, bottom: 10, fontSize: '0.7rem', color: '#b87333', cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setSuggestState({ open: true, key: 'locationAtmosphere' })}
              onKeyDown={(e) => { if (e.key === 'Enter') setSuggestState({ open: true, key: 'locationAtmosphere' }); }}
            >
              Update info
            </span>
          </div>
        )}

        {/* Philosophy & Sourcing */}
          {descriptionBlocks?.['Philosophy & Sourcing'] && (
          <div className="guide-section" style={{ position: 'relative', paddingBottom: 28 }}>
            <div className="section-header">
              <div className="section-icon">🌱</div>
              <h3>Philosophy & Sourcing</h3>
            </div>
            <p>{descriptionBlocks['Philosophy & Sourcing']}</p>
            <span
              role="button"
              tabIndex={0}
              style={{ position: 'absolute', right: 12, bottom: 10, fontSize: '0.7rem', color: '#b87333', cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setSuggestState({ open: true, key: 'philosophySourcing' })}
              onKeyDown={(e) => { if (e.key === 'Enter') setSuggestState({ open: true, key: 'philosophySourcing' }); }}
            >
              Update info
            </span>
          </div>
        )}

        {/* Equipment & Technique */}
          {descriptionBlocks?.['Equipment & Technique'] && (
          <div className="guide-section" style={{ position: 'relative', paddingBottom: 28 }}>
            <div className="section-header">
              <div className="section-icon">⚙️</div>
              <h3>Equipment & Technique</h3>
            </div>
            <p>{descriptionBlocks['Equipment & Technique']}</p>
            <span
              role="button"
              tabIndex={0}
              style={{ position: 'absolute', right: 12, bottom: 10, fontSize: '0.7rem', color: '#b87333', cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setSuggestState({ open: true, key: 'equipmentTechnique' })}
              onKeyDown={(e) => { if (e.key === 'Enter') setSuggestState({ open: true, key: 'equipmentTechnique' }); }}
            >
              Update info
            </span>
          </div>
        )}

        {/* Recommendation */}
          {descriptionBlocks?.['Recommendation'] && (
          <div className="guide-section recommendation" style={{ position: 'relative', paddingBottom: 28 }}>
            <div className="section-header">
              <div className="section-icon">💡</div>
              <h3>Our Recommendation</h3>
            </div>
            <p>{descriptionBlocks['Recommendation']}</p>
            <span
              role="button"
              tabIndex={0}
              style={{ position: 'absolute', right: 12, bottom: 10, fontSize: '0.7rem', color: '#b87333', cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setSuggestState({ open: true, key: 'recommendation' })}
              onKeyDown={(e) => { if (e.key === 'Enter') setSuggestState({ open: true, key: 'recommendation' }); }}
            >
              Update info
            </span>
          </div>
        )}

        {/* Working Hours */}
        <div className="guide-section" style={{ position: 'relative', paddingBottom: 28 }}>
          <div className="section-header">
            <div className="section-icon">🕒</div>
            <h3>Working Hours</h3>
          </div>
          <div className="hours-container">
            {formatHours(workingHours)}
          </div>
          <span
            role="button"
            tabIndex={0}
            style={{ position: 'absolute', right: 12, bottom: 10, fontSize: '0.7rem', color: '#b87333', cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setSuggestState({ open: true, key: 'workingHours' })}
            onKeyDown={(e) => { if (e.key === 'Enter') setSuggestState({ open: true, key: 'workingHours' }); }}
          >
            Update info
          </span>
        </div>

        {/* Wanna Coffee Impression Logo */}
        {coffeeShop.fact_check && (
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
        {/* Автор гайда */}
        <div className="guide-author">
          <span className="guide-author-label">Guide by:</span>
          <img src={WcImpressionLogo} alt="Wanna Coffee Impression" className="guide-author-logo" />
        </div>
      </div>
      
      {/* Модальное окно с объяснением волн */}
      {showWaveInfo && (
        <Modal onClose={() => setShowWaveInfo(false)}>
          <div style={{ padding: 18, maxWidth: 340, fontSize: '1em' }}>
            <h3 style={{ margin: '0 0 10px 0', fontWeight: 600, fontSize: '1.3em', color: '#333' }}>Coffee shop style</h3>
            {waveInfoText}
          </div>
        </Modal>
      )}
      {suggestState.open && (
        <SuggestionModal
          open={suggestState.open}
          onClose={() => setSuggestState({ open: false, key: null })}
          shop={coffeeShop}
          initialSectionKey={suggestState.key}
          onSubmit={(payload) => addSuggestion(payload)}
        />
      )}
    </div>
  );
};

export default GuideCoffeeCard; 