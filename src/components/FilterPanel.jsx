import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { filtersConfig } from '../filtersConfig';

// Кастомный чекбокс-компонент (вынесен на верхний уровень)
export const CustomCheckbox = ({ checked, onChange, label, id }) => (
  <label style={{
    display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', userSelect: 'none', fontSize: '0.93em', lineHeight: 1.2,
  }} htmlFor={id}>
    <span style={{
      display: 'inline-block',
      width: 13,
      height: 13,
      minWidth: 13,
      minHeight: 13,
      border: '1.1px solid #bdbdbd',
      borderRadius: 4,
      background: checked ? '#fff' : '#fff',
      position: 'relative',
      marginRight: 4,
      boxSizing: 'border-box',
      transition: 'border-color 0.15s',
      ...(checked ? { borderColor: '#d3914b' } : {}),
    }}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          opacity: 0,
          width: 13,
          height: 13,
          position: 'absolute',
          left: 0,
          top: 0,
          margin: 0,
          cursor: 'pointer',
        }}
      />
      {checked && (
        <svg viewBox="0 0 13 13" width={10} height={10} style={{ position: 'absolute', left: 1.5, top: 0.5 }}>
          <polyline
            points="1,7 5,11 11,3"
            style={{
              fill: 'none',
              stroke: '#d3914b',
              strokeWidth: 1.7,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
            }}
          />
        </svg>
      )}
    </span>
    {label}
  </label>
);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: 12 }}>
      {filtersConfig.map(filter => (
        <div key={filter.key} style={{ marginBottom: 2, borderBottom: '1px solid #eee', paddingBottom: 2 }}>
          <div
            style={{ fontWeight: 600, marginBottom: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', userSelect: 'none', fontSize: '0.97em', lineHeight: 1.2 }}
            onClick={() => toggleFilter(filter.key)}
          >
            <span style={{ marginRight: 4, fontSize: '0.7em' }}>
              {openFilters.includes(filter.key) ? '▼' : '▶'}
            </span>
            {filter.title}
          </div>
          {openFilters.includes(filter.key) && (
            <div style={{ paddingLeft: 10 }}>
              {filter.type.startsWith('checkbox') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {filter.options.map(opt => (
                    <CustomCheckbox
                      key={opt.value}
                      id={`filter-${filter.key}-${opt.value}`}
                      checked={Array.isArray(filters[filter.key])
                        ? filters[filter.key].includes(opt.value)
                        : filters[filter.key] === opt.value || filters[filter.key] === true}
                      onChange={() => handleCheckbox(filter.key, opt.value, filter.multi)}
                      label={opt.label}
                    />
                  ))}
                </div>
              )}
              {/* Вложенный селект для roasting */}
              {filter.nested && Array.isArray(filters[filter.key]) && filters[filter.key].length > 0 && (
                <div style={{ marginTop: 4 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.8rem', marginBottom: 2 }}>{filter.nested.title}:</label>
                  <select
                    value={filters[filter.nested.key] || ''}
                    onChange={e => handleSelect(filter.nested.key, e.target.value)}
                    style={{ padding: 4, borderRadius: 3, border: '1px solid #ddd' }}
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
                  style={{ padding: 4, borderRadius: 3, border: '1px solid #ddd' }}
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
    '@media (max-width: 768px)': {
      gap: 8,
    },
  },
  filterGroup: {
    marginBottom: 6,
    borderBottom: '1px solid #eee',
    paddingBottom: 4,
    '@media (max-width: 768px)': {
      marginBottom: 4,
      paddingBottom: 2,
    },
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
      fontSize: '0.8rem',
      padding: '4px 0',
      marginBottom: 2,
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
      paddingLeft: 16,
      paddingTop: 2,
    },
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    '@media (max-width: 768px)': {
      gap: 1,
    },
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.85rem',
    padding: '2px 0',
    fontWeight: 400,
    cursor: 'pointer',
    userSelect: 'none',
    '@media (max-width: 768px)': {
      fontSize: '0.75rem',
      padding: '1px 0',
      gap: 4,
    },
  },
  checkbox: {
    marginRight: 6,
    '@media (max-width: 768px)': {
      marginRight: 4,
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

// Минималистичные глобальные стили для чекбоксов
const globalStyles = `
  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 16px;
    height: 16px;
    border: 1.2px solid #bdbdbd;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    transition: border-color 0.15s;
    margin: 0;
    position: relative;
  }
  input[type="checkbox"]:hover {
    border-color: #d3914b;
  }
  input[type="checkbox"]:checked {
    border-color: #d3914b;
    background: #fff;
  }
  input[type="checkbox"]:checked::after {
    content: '';
    display: block;
    position: absolute;
    left: 4px;
    top: 1px;
    width: 6px;
    height: 10px;
    border: solid #d3914b;
    border-width: 0 2px 2px 0;
    border-radius: 1px;
    transform: rotate(45deg);
  }
  @media (max-width: 768px) {
    input[type="checkbox"] {
      width: 14px;
      height: 14px;
    }
    input[type="checkbox"]:checked::after {
      left: 3px;
      top: 0px;
      width: 5px;
      height: 8px;
      border-width: 0 1.7px 1.7px 0;
    }
  }
`;

// Вставляем стили в head (однократно)
if (typeof document !== 'undefined' && !document.getElementById('custom-checkbox-style')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'custom-checkbox-style';
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}

export default FilterPanel;