import React from 'react';

const EventCard = ({ event, expanded, onExpand }) => {
  // Парсим datetime для отображения даты и времени
  const eventDate = new Date(event.datetime);
  const dateString = eventDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  const timeString = eventDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className={`event-card${expanded ? ' expanded' : ''}`} onClick={onExpand}>
      <div className="event-card-top-row">
        <div className="event-card-main-info">
          <div className="event-card-shop"><span role="img" aria-label="coffee">☕</span> {event.coffeeShopName}</div>
          <div className="event-card-title"><span role="img" aria-label="event">📝</span> {event.title}</div>
        </div>
        <div className="event-card-date-badge">
          <span role="img" aria-label="calendar">📆</span> {dateString} <span role="img" aria-label="time">⏰</span> {timeString}
        </div>
      </div>
      <div className="event-card-status-row">
        <div className="event-card-capacity-badge">
          <span role="img" aria-label="user">👤</span> {event.capacity.registered} / {event.capacity.total}
        </div>
        <div className="event-card-location-badge">
          <span role="img" aria-label="location">📍</span> {event.coffeeShopName}
        </div>
      </div>
      <div className="event-card-bottom-row">
        <button className="event-card-im-in-btn">I'm in</button>
        <span className="event-card-reminder" title="Set reminder"><span role="img" aria-label="reminder">🔔</span></span>
      </div>
      {expanded && (
        <div className="event-card-details">
          <div className="event-card-description">{event.description}</div>
          <div className="event-card-price">
            {event.price > 0 ? `Price: $${event.price}` : 'Free event'}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard; 