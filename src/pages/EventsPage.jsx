import React, { useState, useMemo } from 'react';
import EventsCalendar from '../components/EventsCalendar';
import EventCard from '../components/EventCard';
import eventsData from '../data/events.json';
import '../styles/events/events.css';

const EventsPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null);

  // Фильтруем события по дате
  const filteredEvents = useMemo(() => {
    if (!selectedDate) return eventsData;
    return eventsData.filter(ev =>
      new Date(ev.datetime).toDateString() === selectedDate.toDateString()
    );
  }, [selectedDate]);

  // Обработка раскрытия карточки
  const handleExpand = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  return (
    <div className="events-root">
      <h1>Events Page</h1>
      
      {/* Основной контент */}
      <div className="events-content">
        {/* Календарь */}
        <div className="events-calendar-section">
          <EventsCalendar
            events={eventsData}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onClear={() => setSelectedDate(null)}
          />
        </div>

        {/* Список событий */}
        <div className="events-list-section">
          <h2>Events</h2>
          <div className="events-cards">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                expanded={expandedEventId === event.id}
                onExpand={() => handleExpand(event.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage; 