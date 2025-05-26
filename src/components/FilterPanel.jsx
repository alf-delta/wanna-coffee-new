import React from 'react';
import PropTypes from 'prop-types';

const FilterPanel = ({ radius, setRadius }) => {
  return (
    <div style={styles.container}>
      <label style={styles.label}>Search Radius: {radius} km</label>
      <input
        type="range"
        min="1"
        max="10"
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        style={styles.slider}
      />
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    top: '100px',
    left: '20px',
    width: '260px',
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
  },
};

FilterPanel.propTypes = {
  radius: PropTypes.number.isRequired,
  setRadius: PropTypes.func.isRequired,
};

export default FilterPanel;