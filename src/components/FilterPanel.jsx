import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { filtersConfig } from '../filtersConfig';

const FilterPanel = ({ filters, setFilters }) => {
  // Состояние: какие фильтры открыты
  const [openFilters, setOpenFilters] = useState(() => filtersConfig.map(f => f.key));

  const toggleFilter = (key) => {
    setOpenFilters(prev => prev.includes(key)
      ? prev.filter(k => k !== key)
      : [...prev, key]
    );
  };

  // Обработчик для чекбоксов (multi и single)
  const handleCheckbox = (filterKey, value, multi) => {
    setFilters(prev => {
      const prevVal = prev[filterKey] || (multi ? [] : false);
      if (multi) {
        if (prevVal.includes(value)) {
          return { ...prev, [filterKey]: prevVal.filter(v => v !== value) };
        } else {
          return { ...prev, [filterKey]: [...prevVal, value] };
        }
      } else {
        return { ...prev, [filterKey]: prevVal === value ? false : value };
      }
    });
  };

  // Обработчик для select
  const handleSelect = (filterKey, value) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  return (
    <div style={styles.container}>
      {filtersConfig.map(filter => (
        <div key={filter.key} style={styles.filterGroup}>
          <div
            style={styles.filterHeader}
            onClick={() => toggleFilter(filter.key)}
          >
            <span style={styles.toggleIcon}>
              {openFilters.includes(filter.key) ? '▼' : '▶'}
            </span>
            {filter.title}
          </div>
          {openFilters.includes(filter.key) && (
            <div style={styles.filterContent}>
              {/* Чекбоксы */}
              {filter.type.startsWith('checkbox') && (
                <div style={styles.checkboxGroup}>
                  {filter.options.map(opt => (
                    <label key={opt.value} style={styles.checkboxLabel}>
      <input
                        type="checkbox"
                        checked={Array.isArray(filters[filter.key])
                          ? filters[filter.key].includes(opt.value)
                          : filters[filter.key] === opt.value || filters[filter.key] === true}
                        onChange={() => handleCheckbox(filter.key, opt.value, filter.multi)}
                        style={styles.checkbox}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              )}
              {/* Вложенный селект для roasting */}
              {filter.nested && Array.isArray(filters[filter.key]) && filters[filter.key].length > 0 && (
                <div style={styles.nestedSelect}>
                  <label style={styles.nestedLabel}>{filter.nested.title}:</label>
                  <select
                    value={filters[filter.nested.key] || ''}
                    onChange={e => handleSelect(filter.nested.key, e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Any</option>
                    {filter.nested.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}
              {/* Селекты (если появятся в будущем) */}
              {filter.type === 'select' && (
                <select
                  value={filters[filter.key] || ''}
                  onChange={e => handleSelect(filter.key, e.target.value)}
                  style={styles.select}
                >
                  <option value="">Any</option>
                  {filter.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  filterGroup: {
    marginBottom: 6,
    borderBottom: '1px solid #eee',
    paddingBottom: 4,
  },
  filterHeader: {
    fontWeight: 600,
    marginBottom: 4,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    fontSize: '0.9rem',
    '@media (max-width: 768px)': {
      fontSize: '0.85rem',
      padding: '6px 0',
    },
  },
  toggleIcon: {
    marginRight: 4,
    fontSize: '0.7rem',
    '@media (max-width: 768px)': {
      marginRight: 6,
    },
  },
  filterContent: {
    paddingLeft: 16,
    '@media (max-width: 768px)': {
      paddingLeft: 20,
    },
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.85rem',
    padding: '2px 0',
    fontWeight: 400,
    '@media (max-width: 768px)': {
      fontSize: '0.8rem',
      padding: '1.5px 0',
  },
  },
  checkbox: {
    width: 16,
    height: 16,
    accentColor: '#d3914b',
    marginRight: 6,
    '@media (max-width: 768px)': {
      width: 15,
      height: 15,
      marginRight: 5,
    },
  },
  nestedSelect: {
    marginTop: 6,
  },
  nestedLabel: {
    fontWeight: 500,
    fontSize: '0.8rem',
    '@media (max-width: 768px)': {
      fontSize: '0.75rem',
    },
  },
  select: {
    marginLeft: 6,
    padding: 3,
    fontSize: '0.8rem',
    borderRadius: 3,
    border: '1px solid #ddd',
    '@media (max-width: 768px)': {
      fontSize: '0.75rem',
      padding: 4,
      marginTop: 3,
    width: '100%',
    },
  },
};

FilterPanel.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default FilterPanel;