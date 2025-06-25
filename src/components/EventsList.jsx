import React from 'react';

const EventsList = ({ events, onHover, onClick, selectedEventId }) => (
  <div className="events-list" aria-label="List of events">
    {events.length === 0 && <div className="events-empty">No events for the selected date</div>}
    {events.map(ev => (
      <div
        key={ev.id}
        className={`event-row${selectedEventId === ev.id ? ' selected' : ''}`}
        onMouseEnter={() => onHover(ev.id, ev.coffeeShopId)}
        onMouseLeave={() => onHover(null, null)}
        onClick={() => onClick(ev.id, ev.coffeeShopId)}
        tabIndex={0}
        aria-label={`Event: ${ev.title}, ${new Date(ev.datetime).toLocaleString()}, ${ev.coffeeShopName}`}
      >
        <div className="event-title">{ev.title}</div>
        <div className="event-meta">
          <span>{new Date(ev.datetime).toLocaleString()}</span>
          <span>{ev.coffeeShopName}</span>
          {ev.price && <span>{ev.price} RUB</span>}
        </div>
        <div className="event-desc">{ev.description}</div>
      </div>
    ))}
  </div>
);

export default EventsList; 