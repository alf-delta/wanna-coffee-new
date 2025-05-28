import React from 'react';
import PropTypes from 'prop-types';

const feetOptions = [750, 1500, 2500, 3500, 5000];
const timeOptions = [3, 5, 8, 10, 15];

const FilterPanel = ({ radiusIdx, setRadiusIdx, filters, setFilters }) => {
  const featureIcons = {
    wifi: '📶',
    'outdoor seating': '🌳',
    food: '🥐',
    wine: '🍷',
  };

  const handleFeatureChange = (feature) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    setFilters({ ...filters, features: newFeatures });
  };

  const handleSliderChange = (e) => {
    const newValue = Number(e.target.value);
    console.log('FilterPanel: handleSliderChange', { newValue });
    setRadiusIdx(newValue);
  };

  console.log('FilterPanel: render', { radiusIdx });

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Filters</h3>
      <div style={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 22 }}>🚶‍♂️</span>
          <span style={{ fontSize: 22 }}>🏃‍♂️</span>
        </div>
        <input
          type="range"
          min={0}
          max={timeOptions.length - 1}
          step={1}
          value={radiusIdx}
          onChange={handleSliderChange}
          style={{
            width: '100%',
            accentColor: '#d3914b',
            height: 6,
            borderRadius: 3,
            marginBottom: 12,
            marginTop: 0,
          }}
        />
        <div style={{
          textAlign: 'center',
          fontWeight: 600,
          fontSize: 18,
          color: '#d3914b',
          marginTop: 0,
          marginBottom: 0,
          letterSpacing: 1,
        }}>
          ≈ {timeOptions[radiusIdx]} min walk<br />
          <span style={{ fontSize: 13, color: '#888' }}>{feetOptions[radiusIdx]} ft</span>
        </div>
      </div>
      <div style={styles.section}>
        <label style={styles.label}>Features:</label>
        <div style={styles.features}>
          {['wifi', 'outdoor seating', 'food', 'wine'].map((feature) => (
            <label key={feature} style={styles.feature}>
              <input
                type="checkbox"
                checked={filters.features.includes(feature)}
                onChange={() => handleFeatureChange(feature)}
                style={styles.checkbox}
              />
              <span style={{ fontSize: '1.2em', marginRight: 4 }}>{featureIcons[feature]}</span>
              {feature.charAt(0).toUpperCase() + feature.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '0.25rem',
  },
  slider: {
    width: '100%',
    height: '4px',
    backgroundColor: '#ddd',
    borderRadius: '2px',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    '::-webkit-slider-thumb': {
      WebkitAppearance: 'none',
      appearance: 'none',
      width: '16px',
      height: '16px',
      backgroundColor: '#d3914b',
      borderRadius: '50%',
      cursor: 'pointer',
    },
    '::-moz-range-thumb': {
      width: '16px',
      height: '16px',
      backgroundColor: '#d3914b',
      borderRadius: '50%',
      cursor: 'pointer',
      border: 'none',
    },
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#666',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
};

FilterPanel.propTypes = {
  radiusIdx: PropTypes.number.isRequired,
  setRadiusIdx: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default FilterPanel;