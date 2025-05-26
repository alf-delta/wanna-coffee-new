import React, { useState, useEffect } from 'react';
import CoffeeMap from '../components/CoffeeMap';
import FilterPanel from '../components/FilterPanel';
import CoffeeList from '../components/CoffeeList';

// Временно импортируем мок-данные кофеен
import coffeeShopsData from '../utils/mockCoffeeShops';

const Home = () => {
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [radiusCircle, setRadiusCircle] = useState(1000); // в метрах
  const [mapCenter, setMapCenter] = useState([-73.9712, 40.7831]); // координаты Манхэттена

  useEffect(() => {
    // В будущем — API вызов
    setCoffeeShops(coffeeShopsData);
  }, []);

  return (
    <div className="homeContainer" style={{ display: 'flex', height: '100vh' }}>
      <div
        className="sidebar"
        style={{
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
          backgroundColor: '#f9f9f9',
          justifyContent: 'flex-start',
          gap: '1rem',
          overflowY: 'auto'
        }}
      >
        <FilterPanel
          radiusCircle={radiusCircle}
          setRadiusCircle={setRadiusCircle}
        />
        <CoffeeList shops={coffeeShops} />
      </div>
      <div className="mapContainer" style={{ flex: 1 }}>
        <CoffeeMap
          coffeeShops={coffeeShops}
          radiusCircle={radiusCircle}
          setMapCenter={setMapCenter}
          mapCenter={mapCenter}
        />
      </div>
    </div>
  );
};

export default Home;