import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Footer } from '../containers';
import { Navbar } from '../components';
import Header from './header';
import { Helmet } from 'react-helmet';

const MainPageComponent = ({ user, onSignOut }) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      let isMounted = true;
      const fetchEvents = async () => {
        if (!isMounted) return;
        setIsLoading(true);
        try {
          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
          const response = await axios.get(`${apiUrl}/events`);
          if (isMounted) {
            const filteredEvents = filterUpcomingEvents(response.data);
            setEvents(prevEvents => {
              if (JSON.stringify(prevEvents) !== JSON.stringify(filteredEvents)) {
                return filteredEvents;
              }
              return prevEvents;
            });
          }
        } catch (error) {
          console.error('Error fetching events:', error);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };
  
      fetchEvents();
      const interval = setInterval(fetchEvents, 30000);
  
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }, []);
  
    const filterUpcomingEvents = (events) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return events.filter(event => {
        const eventDate = new Date(event.date._seconds * 1000);
        return eventDate >= today;
      });
    };
  
    return (
      <>
        <Helmet>
          <title>Happening</title>
          <meta name="description" content="Discover and explore events happening at Stanford University. Your comprehensive guide to campus activities, talks, and more." />
          <meta name="keywords" content="Stanford events, Stanford activities, Stanford student life, Stanford University" />
        </Helmet>
        <div className="App">
          <div className="gradient__bg">
            <Navbar user={user} onSignOut={onSignOut} />
          </div>
          <h2>Your guide to everything happening at Stanford.</h2>
          <Header events={events} />
          <Footer />
        </div>
      </>
    );
  };

  export default MainPageComponent;