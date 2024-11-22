// Calendar.js
import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './styles/Calendar.css';
import { useSelector } from 'react-redux';

// Set up the localizer for the BigCalendar
const localizer = momentLocalizer(moment);

const Calendar = () => {
  // State variables
  const [events, setEvents] = useState([]); // Stores all events
  const [filter, setFilter] = useState('all'); // Current filter ('all' or 'today')
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date displayed in the calendar
  const [selectedDateEvents, setSelectedDateEvents] = useState(null); // Events for a selected date

  // Get selected student from global state (Redux)
  const selectedChildState = useSelector((state) => state.selectedChild);
  const { child: selectedChild } = selectedChildState;

  // Fetch events when selected child changes
  useEffect(() => {
    if (selectedChild) {
      fetchEvents(selectedChild._id);
    }
  }, [selectedChild]);

  // Function to fetch events from the server
  const fetchEvents = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events?studentId=${studentId}`);
      const formattedEvents = response.data.map(event => ({
        ...event,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Filter events based on the current filter
  const filteredEvents = events.filter(event => {
    if (filter === 'today') {
      return moment(event.start).isSame(moment(), 'day');
    }
    return true;
  });

  // Component to render individual event items
  const EventItem = ({ event }) => (
    <div className="event-item">
      <div className='event-item-title'>{event.eventName}</div>
      <p>{moment(event.start).format('MMMM D, YYYY h:mm A')} - {moment(event.end).format('h:mm A')}</p>
      <p>{event.eventType} - {event.location}</p>
    </div>
  );

  // Custom toolbar component for the calendar
  const CustomToolbar = toolbar => {
    const goToBack = () => {
      const newDate = moment(toolbar.date).subtract(1, 'month').toDate();
      toolbar.onNavigate('prev', newDate);
    };

    const goToNext = () => {
      const newDate = moment(toolbar.date).add(1, 'month').toDate();
      toolbar.onNavigate('next', newDate);
    };

    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span className="toolbar-label">{date.format('MMMM YYYY')}</span>
      );
    };

    return (
      <div className="custom-toolbar">
        <button className="triangle-1" onClick={goToBack}></button>
        {label()}
        <button className="triangle-2" onClick={goToNext}></button>
      </div>
    );
  };

  // Custom Date Header to display red dot in the date cell
  const CustomDateHeader = ({ label, date }) => {
    const eventsOnDate = events.filter(
      (event) =>
        moment(event.start).startOf('day').isSame(moment(date).startOf('day'))
    );
    const eventCount = eventsOnDate.length;
    const dotSize = Math.min(10 + eventCount * 4, 20); // Adjust size based on event count

    const handleClick = () => {
      if (eventCount > 0) {
        setSelectedDateEvents(eventsOnDate);
      }
    };

    return (
      <div className="custom-date-header" onClick={handleClick}>
        <div className="date-label">{label}</div>
        {eventCount > 0 && (
          <div
            className="custom-event-dot"
            style={{ width: dotSize, height: dotSize }}
          ></div>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      {/* Calendar title and comment */}
      <div className='calendar-title-container'>
        <div className="calendar-title">Calendar</div>
        <div className="calendar-comment">
        Stay up to date with all your child's important school events!
        </div>
      </div>
    
      <div className="calendar-content">
        {selectedDateEvents ? (
          // Display events for a selected date
          <div className="event-details">
            <button className="back-button" onClick={() => setSelectedDateEvents(null)}>Back</button>
            <h4>Events on {moment(selectedDateEvents[0].start).format('MMMM D, YYYY')}</h4>
            <ul>
              {selectedDateEvents.map((event, index) => (
                <li key={index}>
                  <div className='event-item-pin'>{event.eventName}</div>
                  <p>{moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}</p>
                  <p>{event.eventType} - {event.location}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // Display calendar and sidebar
          <>
            {/* Sidebar with filter buttons and upcoming events */}
            <div className="sidebar">
              <div className="filter-buttons">
                <button
                  className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`filter-button ${filter === 'today' ? 'active' : ''}`}
                  onClick={() => setFilter('today')}
                >
                  Today
                </button>
              </div>
              <div className="upcoming-events">
                <div className="upcoming-events-title">Upcoming Events</div>
                <div className="event-list">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, index) => (
                      <EventItem key={index} event={event} />
                    ))
                  ) : (
                    <div className='no-events'>No events to display.</div>
                  )}
                </div>
              </div>
            </div>
            {/* Calendar component */}
            <div className="calendar-wrapper">
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '70vh' }}
                components={{
                  toolbar: CustomToolbar,
                  month: {
                    dateHeader: CustomDateHeader,
                  },
                }}
                eventPropGetter={() => ({ style: { display: 'none' } })} // Hide default events
                onNavigate={(date) => setCurrentDate(date)}
                date={currentDate}
                onSelectEvent={() => {}}
                views={['month']}
                popup={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;