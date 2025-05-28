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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {filtersConfig.map(filter => (
        <div key={filter.key} style={{ marginBottom: 8, borderBottom: '1px solid #eee', paddingBottom: 6 }}>
          <div
            style={{ fontWeight: 600, marginBottom: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', userSelect: 'none' }}
            onClick={() => toggleFilter(filter.key)}
          >
            <span style={{ marginRight: 6 }}>{openFilters.includes(filter.key) ? '▼' : '▶'}</span>
            {filter.title}
          </div>
          {openFilters.includes(filter.key) && (
            <div>
              {/* Чекбоксы */}
              {filter.type.startsWith('checkbox') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {filter.options.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                      <input
                        type="checkbox"
                        checked={Array.isArray(filters[filter.key])
                          ? filters[filter.key].includes(opt.value)
                          : filters[filter.key] === opt.value || filters[filter.key] === true}
                        onChange={() => handleCheckbox(filter.key, opt.value, filter.multi)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              )}
              {/* Вложенный селект для roasting */}
              {filter.nested && Array.isArray(filters[filter.key]) && filters[filter.key].length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: 14 }}>{filter.nested.title}:</label>
                  <select
                    value={filters[filter.nested.key] || ''}
                    onChange={e => handleSelect(filter.nested.key, e.target.value)}
                    style={{ marginLeft: 8, padding: 4, fontSize: 14 }}
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
                  style={{ marginTop: 6, padding: 4, fontSize: 14 }}
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

FilterPanel.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default FilterPanel;