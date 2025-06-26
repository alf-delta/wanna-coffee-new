import React, { useState, useMemo, useEffect } from 'react';
import EventsCalendar from '../components/EventsCalendar';
import EventsList from '../components/EventsList';
import EventsMap from '../components/EventsMap';
import eventsData from '../data/events.json';
import { coffeeShops as allCoffeeShopsData } from '../utils/coffeeShops';

const DEFAULT_CENTER = [-74.006, 40.7128]; // NYC

const AltPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [highlightedEventId, setHighlightedEventId] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 900);

  const eventCoffeeShops = useMemo(() => {
    const shopIds = new Set(eventsData.map(ev => ev.coffeeShopId));
    return allCoffeeShopsData.filter(shop => shopIds.has(shop.id));
  }, []);

  const filteredEvents = useMemo(() => {
    if (!selectedDate) return eventsData;
    return eventsData.filter(ev =>
      new Date(ev.datetime).toDateString() === selectedDate?.toDateString()
    );
  }, [selectedDate]);

  const handleHighlight = (eventId, coffeeShopId) => {
    setHighlightedEventId(eventId);
    const shop = allCoffeeShopsData.find(s => s.id === coffeeShopId);
    if (shop) {
      setMapCenter([shop.longitude, shop.latitude]);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (eventCoffeeShops.length > 0) {
      const firstShop = eventCoffeeShops[0];
      setMapCenter([firstShop.longitude, firstShop.latitude]);
    }
  }, [eventCoffeeShops]);

  useEffect(() => {
    document.body.classList.add('alt-page');
    return () => {
      document.body.classList.remove('alt-page');
    };
  }, []);

  return (
    <div className="alt-main-layout">
      <div className="alt-map-container">
        <EventsMap
          coffeeShops={eventCoffeeShops}
          mapCenter={mapCenter}
          width="100%"
          height="100%"
          className="alt-map"
          aria-label={`Карта с ${eventCoffeeShops.length} кофейнями (Alt)`}
        />
      </div>
      <div className="alt-content-area">
        <div className="alt-layout">
          <div className="alt-calendar-col">
            <EventsCalendar
              events={eventsData}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onClear={() => setSelectedDate(null)}
              isMobile={isMobileView}
            />
          </div>
          <div className="alt-list-col">
            <EventsList
              events={filteredEvents}
              onClick={handleHighlight}
              allCoffeeShops={allCoffeeShopsData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AltPage; 