import React, { useState, useMemo, useRef, useEffect } from 'react';
import EventsCalendar from '../components/EventsCalendar';
import EventsList from '../components/EventsList';
import CoffeeMap from '../components/CoffeeMap';
import eventsData from '../data/events.json';
import { coffeeShops } from '../utils/coffeeShops';

const feetOptions = [750, 1500, 2500, 3500, 5000];

const DEFAULT_CENTER = [-74.006, 40.7128]; // NYC

const EventsPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [highlightedEventId, setHighlightedEventId] = useState(null);
  const [radiusIdx, setRadiusIdx] = useState(0); // индекс радиуса
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const mapRef = useRef();
  const radiusCircle = feetOptions[radiusIdx] / 3.28084; // радиус в метрах

  // Получаем кофейни, связанные с событиями
  const eventCoffeeShops = useMemo(() => {
    const shopIds = new Set(eventsData.map(ev => ev.coffeeShopId));
    return coffeeShops.filter(shop => shopIds.has(shop.id));
  }, []);

  const filteredEvents = useMemo(() => {
    if (!selectedDate) return eventsData;
    return eventsData.filter(ev =>
      new Date(ev.datetime).toDateString() === selectedDate.toDateString()
    );
  }, [selectedDate]);

  const handleHighlight = (eventId, coffeeShopId) => {
    setHighlightedEventId(eventId);
    if (mapRef.current && coffeeShopId) {
      mapRef.current.highlightMarker(coffeeShopId);
    }
  };

  // Центрируем карту на первой кофейне при загрузке
  useEffect(() => {
    if (eventCoffeeShops.length > 0) {
      const firstShop = eventCoffeeShops[0];
      setMapCenter([firstShop.longitude, firstShop.latitude]);
      if (mapRef.current) {
        mapRef.current.flyTo([firstShop.longitude, firstShop.latitude]);
      }
    }
  }, [eventCoffeeShops]);

  useEffect(() => {
    console.log('[EventsPage] mapCenter changed:', mapCenter);
  }, [mapCenter]);

  // Геолокация
  const handleGeoClick = () => {
    console.log('[EventsPage] handleGeoClick called');
    if (!navigator.geolocation) {
      alert('Geolocation is not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCenter = [position.coords.longitude, position.coords.latitude];
        console.log('[EventsPage] geo success, newCenter:', newCenter);
        if (mapRef.current) {
          mapRef.current.flyTo(newCenter, 15);
        }
      },
      (error) => {
        let errorMessage = 'Could not get geolocation';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Please allow access to geolocation'; break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable'; break;
          case error.TIMEOUT:
            errorMessage = 'Geolocation request timed out'; break;
        }
        alert(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // --- вычисляем смещённый центр для мобильных ---
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="events-root">
      <div className="events-map-sticky">
        <CoffeeMap
          ref={mapRef}
          coffeeShops={eventCoffeeShops}
          radiusCircle={radiusCircle}
          mapCenter={mapCenter}
          setMapCenter={setMapCenter}
          highlightShopId={highlightedEventId ? filteredEvents.find(ev => ev.id === highlightedEventId)?.coffeeShopId : null}
          mobileOffsetY={isMobile ? 0 : 0}
        />
      </div>
      {/* Панель управления под картой */}
      <div className="events-map-controls">
        <div className="events-radius-slider">
          <label htmlFor="radius-slider-events" style={{ fontWeight: 500, color: '#d3914b', marginBottom: 4, display: 'block' }}>
            Search radius: {feetOptions[radiusIdx]} ft
          </label>
          <input
            id="radius-slider-events"
            type="range"
            min={0}
            max={feetOptions.length - 1}
            value={radiusIdx}
            onChange={e => setRadiusIdx(Number(e.target.value))}
            className="radius-slider"
            style={{ width: '100%' }}
          />
        </div>
        <button className="events-geo-btn" onClick={handleGeoClick} title="My location">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#d3914b" strokeWidth="2" fill="#fff"/>
            <path d="M12 7v5l4 2" stroke="#d3914b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="events-columns">
        <div className="events-calendar-col">
          <EventsCalendar
            events={eventsData}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onClear={() => setSelectedDate(null)}
          />
        </div>
        <div className="events-list-col">
          <EventsList
            events={filteredEvents}
            onHover={handleHighlight}
            onClick={handleHighlight}
            selectedEventId={highlightedEventId}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPage; 