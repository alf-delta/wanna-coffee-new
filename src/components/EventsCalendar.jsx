import React from 'react';

const getMonthDays = (year, month) => {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const EventsCalendar = ({ events, selectedDate, onSelectDate, onClear }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days = getMonthDays(year, month);

  const eventDates = new Set(events.map(ev => new Date(ev.datetime).toDateString()));

  return (
    <div className="events-calendar" aria-label="Events calendar">
      <div className="calendar-header">
        <span>{now.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
        {selectedDate && (
          <button onClick={onClear} aria-label="Clear filter">Clear</button>
        )}
      </div>
      <div className="calendar-grid">
        {days.map(day => {
          const isEvent = eventDates.has(day.toDateString());
          const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={day.toISOString()}
              className={`calendar-day${isEvent ? ' has-event' : ''}${isSelected ? ' selected' : ''}`}
              onClick={() => onSelectDate(day)}
              aria-label={`Select date ${day.toLocaleDateString('en-US')}`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EventsCalendar; 