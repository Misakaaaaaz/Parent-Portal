import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/UpcomingEvents.css'; 

const UpcomingEvents = ({ studentId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchEvents(studentId);
    }
  }, [studentId]);

  if (loading) {
    return <div>Loading upcoming events...</div>;
  }

  if (events.length === 0) {
    return <div className="no-events-message">No upcoming events to display.</div>;
  }

  const upcomingEvents = events.filter(event => event.start > new Date());

  return (
    <div className="upcoming-events-container">
      <div className="title-1">Upcoming Events</div>
      {upcomingEvents.map((event, index) => (
        <div className="upcoming-event-item" key={index}>
          <div className="event-detail">
            <strong>{event.eventName}</strong>
            <p>{event.start.toLocaleString()}</p>
            <p>{event.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingEvents;
