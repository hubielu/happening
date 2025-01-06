import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { auth, provider, signInWithPopup, signOut } from './firebase';
import { Navbar } from './components';
import './App.css';
import { ParallaxProvider } from 'react-scroll-parallax';
import { FaPizzaSlice } from "react-icons/fa";
import { GiBoba } from "react-icons/gi";
import { Helmet } from 'react-helmet';
import { setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';




const Sitemap = lazy(() => import('./sitemap.xml'));




const isToday = (dateString) => {
  const today = new Date();
  const eventDate = new Date(dateString);

  return (
    today.getDate() === eventDate.getDate() &&
    today.getMonth() === eventDate.getMonth() &&
    today.getFullYear() === eventDate.getFullYear()
  );
};





const LoginPage = lazy(() => import('./components/LoginPage'));





const ProfileDropdown = ({ user, onSignOut }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onSignOut();
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <div className="profile-dropdown">
      <img
        src={user.photoURL}
        alt="Profile"
        className="profile-photo"
        onClick={handleDropdownToggle}
      />
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div className="user-info">
            <p>{user.displayName}</p>
            <p>{user.email}</p>
          </div>
          <button className="sign-out-btn" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

const formatEventTime = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  return date.toLocaleTimeString('en-US', options);
};

const groupEventsByDate = (events, selectedField) => {
  const groupedEvents = {};
  
  if (!events) return [];

  // Filter events if a field is selected
  const filteredEvents = selectedField && selectedField !== 'all'
    ? events.filter(event => event.field === selectedField)
    : events;

  filteredEvents.forEach(event => {
    const eventDate = new Date(event.date._seconds * 1000);
    const dateKey = eventDate.toLocaleDateString();
    
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });

  return Object.keys(groupedEvents)
    .sort((a, b) => new Date(a) - new Date(b))
    .map(dateKey => ({
      date: dateKey,
      events: groupedEvents[dateKey].sort((a, b) => a.date._seconds - b.date._seconds)
    }));
};





const EventList = ({ events }) => {
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [selectedField, setSelectedField] = useState('all');

  const filteredEvents = useMemo(() => {
    return selectedField === 'all' 
      ? events 
      : events.filter(event => event.field === selectedField);
  }, [events, selectedField]);

  const groupedEvents = useMemo(() => groupEventsByDate(filteredEvents), [filteredEvents]);

  const flattenedEvents = useMemo(() => {
    return groupedEvents.reduce((acc, { events }) => {
      return [...acc, ...events];
    }, []).sort((a, b) => a.date._seconds - b.date._seconds);
  }, [groupedEvents]);

  const hasTodayEvents = useMemo(() => {
    return groupedEvents.some(group => isToday(group.date));
  }, [groupedEvents]);

  const renderEventTitle = (event) => {
    return (
      <h3>
        {event.title}
        {event.freefood === "yes" && (
          <span className="icon-tooltip" title="Free Food">
            <FaPizzaSlice 
              style={{
                color: '#8C1515',
                marginLeft: '5px',
                fontSize: '16px'
              }}
            />
          </span>
        )}
        {event.freeboba === "yes" && (
          <span className="icon-tooltip" title="Free Boba">
            <GiBoba
              style={{
                color: '#8C1515',
                marginLeft: '3px',
                fontSize: '23px',
                marginBottom: '3px'
              }}
            />
          </span>
        )}
      </h3>
    );
  };

  const handleEventClick = (clickedEvent) => {
    const index = flattenedEvents.findIndex(event => event.id === clickedEvent.id);
    if (index !== -1) {
      setSelectedEventIndex(index);
    }
  };

  const handleClose = () => {
    setSelectedEventIndex(null);
  };

  const handleNext = () => {
    setSelectedEventIndex(prev => 
      prev < flattenedEvents.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevious = () => {
    setSelectedEventIndex(prev => 
      prev > 0 ? prev - 1 : prev
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const eventDates = document.querySelectorAll('.event-date');
      let shouldBeSticky = false;

      eventDates.forEach((dateElement) => {
        const rect = dateElement.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom > 0) {
          shouldBeSticky = true;
        }
      });

      setIsSticky(shouldBeSticky);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="event-list-container">
      <select 
        value={selectedField}
        onChange={(e) => setSelectedField(e.target.value)}
        className={`field-filter ${!hasTodayEvents ? 'no-today-events' : ''}`}
      >
      
        <option value="all">All Events</option>
        <option value="academic">Academic</option>
        <option value="arts">Arts & Culture</option>
        <option value="career">Career</option>
        <option value="social">Social</option>
        <option value="sports">Sports</option>
        <option value="student-orgs">Student Organizations</option>
        <option value="wellness">Health & Wellness</option>
        <option value="service">Community Service</option>
      </select>

      <div className="event-list">
        {groupedEvents.length === 0 ? (
          <p>No events available.</p>
        ) : (
          groupedEvents.map(({ date, events }) => (
            <div key={date}>
              <div
                className={`event-date ${isSticky ? 'sticky' : ''} ${isToday(date) ? 'today' : ''}`}
              >
                {isToday(date) ? 'Today' : new Date(date).toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
              {events.map(event => (
                <div
                  key={event.id}
                  className="event-item"
                  onClick={() => handleEventClick(event)}
                >
                  <p className="time">{formatEventTime(event.date._seconds)}</p>
                  {renderEventTitle(event)}
                  <p className="location"><strong>{event.location}</strong></p>
                  <p>{event.description}</p>
                </div>
              ))}
            </div>
          ))
        )}
        {selectedEventIndex !== null && (
          <Modal
            events={flattenedEvents}
            currentEventIndex={selectedEventIndex}
            onClose={handleClose}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    </div>
  );
};






const NewsletterSubscription = lazy(() => import('./components/NewsletterSubscription.jsx'));





const Header = ({ events }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      setError(null);

      try {
        // Trigger Google Auth popup
        const result = await signInWithPopup(auth, provider);
        const userEmail = result.user.email;

        // Verify entered email matches authenticated email
        if (email !== userEmail) {
          setError('Please try again.');
          setIsLoading(false);
          return;
        }

        // Verify Stanford email
        if (!userEmail.endsWith('@stanford.edu')) {
          setError('Please use your Stanford email address');
          setIsLoading(false);
          return;
        }

        const url = 'https://script.google.com/macros/s/AKfycbzBKpjnDvlikSXeYdbxFv11QG-J7zHEdq_TvYtWQs9QcSQQuUcSyOpdlIMOYOJIsG18/exec';
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'email=' + encodeURIComponent(email),
        });

        setIsSubscribed(true);
        setEmail('');
        setTimeout(() => setIsSubscribed(false), 2000);

      } catch (error) {
        setError('Authentication required to subscribe');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`NI__header section__padding ${isSticky ? 'sticky' : ''}`} id="home">
      <div className="NI__header-image">
        <EventList events={events} />
      </div>
      <div className="NI__header-content">
        <div className="NI__header-title">
          <h1 className="gradient__text">Weekly Newsletter</h1>
        </div>
        <p>We send a weekly newsletter on Monday at 11am featuring that week's events.</p>
        <form onSubmit={handleSubscribe} className="NI__header-content__input">
          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className={isSubscribed ? 'subscribed' : ''}
            disabled={isLoading}
          >
            {isLoading ? 'Subscribing...' : isSubscribed ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="NI__header-content__people"></div>
      </div>
      <Suspense fallback={<div>Loading newsletter...</div>}>
        <NewsletterSubscription />
      </Suspense>
    </div>
  );
};







const Footer = lazy(() => import('./containers/footer/Footer.jsx'));



const Modal = lazy(() => import('./components/ModalComponent'));





const MainPage = ({ user, onSignOut }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchEvents = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        const response = await axios.get(`${apiUrl}/events`, {
          signal: controller.signal
        });
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
        if (error.name === 'AbortError') return;
        console.error('Error fetching events:', error);
        setError('Failed to fetch events. Please try again later.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const filterUpcomingEvents = useMemo(() => (events) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.filter(event => {
      const eventDate = new Date(event.date._seconds * 1000);
      return eventDate >= today;
    });
  }, []);

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
        {isLoading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Header events={events} />
        )}
        <Footer />
      </div>
    </>
  );
};



const App = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email.endsWith('@stanford.edu')) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user.email.endsWith('@stanford.edu')) {
        setUser(user);
        console.log('Stanford email detected. User signed in:', user.email);
      } else {
        alert('Please sign in with your Stanford email.');
        await signOut(auth);
        setUser(null);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert('You have signed out successfully.');
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    if (currentEventIndex < events.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex(currentEventIndex - 1);
    }
  };

  return (
    <ParallaxProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/stanford" /> : <LoginPage onSignIn={signInWithGoogle} />} />
            <Route path="/login" element={user ? <Navigate to="/stanford" /> : <LoginPage onSignIn={signInWithGoogle} />} />
            <Route path="/stanford" element={user ? <MainPage user={user} onSignOut={handleSignOut} /> : <Navigate to="/login" />} />
            <Route path="/sitemap.xml" element={<Sitemap />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {isModalOpen && (
            <Suspense fallback={<div>Loading modal...</div>}>
              <Modal
                events={events} 
                currentEventIndex={currentEventIndex} 
                onClose={handleCloseModal} 
                onNext={handleNext} 
                onPrevious={handlePrevious}
              />
            </Suspense>
          )}
        </Suspense>
      </Router>
    </ParallaxProvider>
  );
};

export default App;