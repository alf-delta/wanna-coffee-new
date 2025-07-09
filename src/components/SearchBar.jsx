import React, { useState, useRef, useEffect } from 'react';

function isRelevantMatch(shop, query) {
  const q = query.trim().toLowerCase();
  if (!q) return false;

  // Поиск по названию (только начало слова)
  if (shop.name && shop.name.toLowerCase().split(/\s+/).some(word => word.startsWith(q))) {
    return true;
  }

  // Поиск по адресу (только начало слова, не по zip-коду)
  if (shop.address) {
    // Разбиваем адрес на слова и запятые
    const addressWords = shop.address.toLowerCase().split(/[, ]+/);
    // Если query — только цифры и длина < 4, не ищем по адресу
    if (/^\d{1,3}$/.test(q)) return false;
    // Ищем совпадение только с начала слова
    if (addressWords.some(word => word && word.startsWith(q) && !/^\d{3,}$/.test(word))) {
      return true;
    }
  }
  return false;
}

const SearchBar = ({ coffeeShops, onSelect, placeholder = 'Search for a coffee shop...' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = coffeeShops.filter(shop => isRelevantMatch(shop, query)).slice(0, 7);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, coffeeShops]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSelect = (shop) => {
    setQuery(shop.name);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelect(shop);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 120); // to allow onClick to fire
  };

  return (
    <div className="search-bar-wc" style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="search-bar-wc-input"
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="search-bar-wc-suggestions">
          {suggestions.map(shop => (
            <li key={shop.id} onClick={() => handleSelect(shop)}>
              <b>{shop.name}</b>
              <span className="search-bar-wc-address">{shop.address}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar; 