import React, { useState, useEffect, lazy, Suspense, useMemo, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { auth, provider, signInWithPopup, signOut } from './firebase';
import { Navbar } from './components';
import './App.css';
import { ParallaxProvider } from 'react-scroll-parallax';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { FiArrowUpRight } from "react-icons/fi";
import { FaPizzaSlice } from "react-icons/fa";
import { GiBoba } from "react-icons/gi";
import { Helmet } from 'react-helmet';

console.log('API URL:', process.env.REACT_APP_API_URL);





const Header = ({ events }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
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
      setError(null);
      
      try {
        const result = await signInWithPopup(auth, provider);
        const userEmail = result.user.email;
        
        if (email !== userEmail) {
          setError("Please try again.");
          return;
        }

        if (!userEmail.endsWith('@stanford.edu')) {
          setError('Please use your Stanford email address');
          return;
        }

        const url = 'https://script.google.com/macros/s/AKfycbzBKpjnDvlikSXeYdbxFv11QG-J7zHEdq_TvYtWQs9QcSQQuUcSyOpdlIMOYOJIsG18/exec';
        
        setIsSubscribed(true);
        setEmail('');
        
        fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'email=' + encodeURIComponent(email)
        });

        setTimeout(() => {
          setIsSubscribed(false);
        }, 2000);

      } catch (error) {
        setError('Authentication required to subscribe');
        setIsSubscribed(false);
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
            disabled={isSubscribed}
          />
          <button 
            type="submit" 
            className={isSubscribed ? 'subscribed' : ''}
          >
            {isSubscribed ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="NI__header-content__people">
        </div>
      </div>
    </div>
  );
};












const NewsletterSubscription = ({ user }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleSubscribe = async () => {
    try {
      console.log("Attempting to subscribe with email:", user.email);
      const response = await axios.post("http://localhost:5005/api/subscribe", {
        email: user.email,
        name: user.displayName
      });
      console.log("Subscription response:", response);
      if (response.status === 200) {
        setSubscribed(true);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setSubscribed(false);
            setFadeOut(false);
          }, 500); // Duration of fade out effect
        }, 2000); // Duration to show "Subscribed!"
      }
    } catch (error) {
      console.error("Subscription error:", error.response?.data || error.message);
      alert("Subscription failed. Please try again.");
    }
  };
  
  const handleUnsubscribe = async () => {
    try {
      const response = await axios.post("http://localhost:5005/api/unsubscribe", {
        email: user.email
      });
      if (response.status === 200) {
        setSubscribed(false);
        setDropdownVisible(false);
      }
    } catch (error) {
      console.error("Unsubscription error:", error);
      alert("Unsubscription failed. Please try again.");
    }
  };

  return (
    <div className="newsletter-subscription">
      <button
        className={`subscribe-btn ${subscribed ? 'subscribed' : ''} ${fadeOut ? 'fade-out' : ''}`}
        onClick={subscribed ? () => setDropdownVisible(!dropdownVisible) : handleSubscribe}
      >
        {subscribed ? 'Subscribed!' : 'Subscribe'}
      </button>
      {dropdownVisible && (
        <div className="dropdown-menu">
          <button className="unsubscribe-btn" onClick={handleUnsubscribe}>
            Unsubscribe
          </button>
        </div>
      )}
    </div>
  );
};











const isToday = (dateString) => {
  const today = new Date();
  const eventDate = new Date(dateString);

  return (
    today.getDate() === eventDate.getDate() &&
    today.getMonth() === eventDate.getMonth() &&
    today.getFullYear() === eventDate.getFullYear()
  );
};

const LoginPage = React.memo(({ onSignIn }) => (
  <>
    <Helmet>
      <title>Happening</title>
      <meta name="description" content="Sign in to Happening at Stanford - Your go-to guide for events and activities at Stanford University." />
      <meta name="keywords" content="Stanford Happening, Stanford Happening login, Happening login, Stanford events" />
      <link rel="preload" as="style" href="/login-page.css" />
      <link rel="preload" as="script" href="/firebase-auth.js" />
    </Helmet>
    <div className="login-page">
      <div className="gradient-outline-box">
        <h1>Welcome to <span className="gradient__text">Happening</span></h1>
        <p>Your go-to guide to everything happening at Stanford.</p>
        <button 
          onClick={onSignIn} 
          className="sign-in-btn"
          aria-label="Sign in with Stanford email"
        >
          Sign in
        </button>
      </div>
    </div>
  </>
));

LoginPage.displayName = 'LoginPage';


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
  if (!timestamp || !timestamp._seconds) return '';
  const date = new Date(timestamp._seconds * 1000);
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
  const [cachedEvents, setCachedEvents] = useState({});

  useEffect(() => {
      // Ensure events is an array before processing
      const eventsList = Array.isArray(events) ? events : [];
      const eventCache = {};
      eventsList.forEach(event => {
          if (event && event.id) {
              eventCache[event.id] = event;
          }
      });
      setCachedEvents(eventCache);
  }, [events]);

  const filteredEvents = useMemo(() => {
      const eventsList = Object.values(cachedEvents);
      if (!Array.isArray(eventsList)) return [];
      return selectedField === 'all' 
          ? eventsList 
          : eventsList.filter(event => event && event.field === selectedField);
  }, [cachedEvents, selectedField]);

  const groupedEvents = useMemo(() => groupEventsByDate(events, selectedField), [events, selectedField]);

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
    const index = events.findIndex(event => event.id === clickedEvent.id);
    if (index !== -1) {
      setSelectedEventIndex(index);
    }
  };

  const handleClose = () => {
    setSelectedEventIndex(null);
  };

  const handleNext = () => {
    setSelectedEventIndex(prev => 
      prev < events.length - 1 ? prev + 1 : prev
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
          events={events}
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








const MainPage = ({ user, onSignOut }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/events`);
      const data = await response.json();
      
      // Validate that data is an array before setting state
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error('Received non-array data:', data);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };
  

  useEffect(() => {
    let isMounted = true;
  
    const loadEvents = async () => {
      try {
        await fetchEvents();
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading events:', error);
          setIsLoading(false);
        }
      }
    };
  
    loadEvents();
  
    return () => {
      isMounted = false;
    };
  }, []);
  


  if (!events || !Array.isArray(events)) {
    return <div>No events available</div>;
  }
  
  if (isLoading) {
    return <div>Loading events...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Happening</title>
        <meta name="description" content="Discover and explore events happening at Stanford University." />
      </Helmet>
      <div className="App">
        <div className="gradient__bg">
          <Navbar user={user} onSignOut={onSignOut} />
        </div>
        <h2>Your guide to everything happening at Stanford.</h2>
        <Header events={events} />
      </div>
    </>
  );
};


const Modal = ({ events, currentEventIndex, onClose, onNext, onPrevious }) => {
  const [isActive, setIsActive] = React.useState(false);
  const event = events[currentEventIndex];
  const modalRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsActive(true), 50);
    
    // Preload next event's data
    if (currentEventIndex < events.length - 1) {
      const nextEvent = events[currentEventIndex + 1];
      if (nextEvent) {
        // Preload Google Maps data
        const mapLink = document.createElement('link');
        mapLink.rel = 'preload';
        mapLink.as = 'fetch';
        mapLink.href = `https://www.google.com/maps/search/${encodeURIComponent(nextEvent.location)}`;
        mapLink.crossOrigin = 'anonymous';
        document.head.appendChild(mapLink);

        // Preload RSVP link if it exists
        if (nextEvent.rsvp && nextEvent.rsvp.startsWith('http')) {
          const rsvpLink = document.createElement('link');
          rsvpLink.rel = 'preload';
          rsvpLink.as = 'fetch';
          rsvpLink.href = nextEvent.rsvp;
          rsvpLink.crossOrigin = 'anonymous';
          document.head.appendChild(rsvpLink);
        }
      }
    }

    return () => {
      clearTimeout(timer);
      // Clean up preload links
      const preloadLinks = document.head.querySelectorAll('link[rel="preload"]');
      preloadLinks.forEach(link => link.remove());
    };
  }, [currentEventIndex, events]);

  const handleClose = () => {
    setIsActive(false);
    setTimeout(onClose, 300);
  };

  const formatEventDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit' };
    return {
      date: date.toLocaleDateString(undefined, options),
      time: date.toLocaleTimeString(undefined, timeOptions),
      day: date.getDate(),
      month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    };
  };

  const formattedDate = formatEventDate(event.date._seconds);

  return (
    <div 
      className={`modal-overlay ${isActive ? 'active' : ''}`} 
      onClick={handleClose}
      ref={modalRef}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          <IoClose size={20} className="icon-gradient" loading="lazy" />
        </button>
        <div className="navigation-buttons">
          <button
            className="prev-btn"
            onClick={onPrevious}
            disabled={currentEventIndex === 0}
          >
            <IoIosArrowUp size={20} className="icon-gradient" loading="lazy" />
          </button>
          <button
            className="next-btn"
            onClick={onNext}
            disabled={currentEventIndex === events.length - 1}
          >
            <IoIosArrowDown size={20} className="icon-gradient" loading="lazy" />
          </button>
        </div>
        <h2>{event.title}</h2>
        <div className="event-time-container">
          <div className="calendar-icon">
            <div className="calendar-month">{formattedDate.month}</div>
            <div className="calendar-day">{formattedDate.day}</div>
          </div>
          <div className="event-date-time">
            <div className="event-date">{formattedDate.date}</div>
            <div className="event-time">{formattedDate.time}</div>
          </div>
        </div>
        <div className="location-container">
          <CiLocationOn 
            className="location-icon"
            onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(event.location)}`, '_blank')}
            loading="lazy"
          />
          <span 
            className="location-text"
            onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(event.location)}`, '_blank')}
          >
            {event.location}
            <FiArrowUpRight className="arrow-icon" loading="lazy" />
          </span>
        </div>
        <p>{event.description}</p>
        <div className="rsvp-section">
          <h3>Registration</h3>
          {event && event.rsvp ? (
            <div>
              <p>Welcome! To join the event, please register below.</p>
              <button 
                className="rsvp-button"
                onClick={() => {
                  if (event.rsvp && event.rsvp.startsWith('http')) {
                    window.open(event.rsvp, '_blank');
                  } else {
                    console.error('Invalid RSVP URL:', event.rsvp);
                  }
                }}
              >
                RSVP here
              </button>
            </div>
          ) : (
            <p className="no-rsvp">No RSVP required</p>
          )}
        </div>
        <div className="modal-icons">
          {event.freefood === "yes" && (
            <span className="icon-tooltip" title="Free Food">
              <FaPizzaSlice style={{ color: '#8C1515', fontSize: '24px', marginRight: '10px' }} loading="lazy" />
            </span>
          )}
          {event.freeboba === "yes" && (
            <span className="icon-tooltip" title="Free Boba">
              <GiBoba style={{ color: '#8C1515', fontSize: '30px' }} loading="lazy" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};


const NewsletterSection = lazy(() => import('./components/NewsletterSection'));


const Footer = lazy(() => import('./containers/footer/Footer'));
const Sitemap = lazy(() => import('./sitemap.xml'));


const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email.endsWith('@stanford.edu')) {
        setUser(user);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
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

  if (!isAuthReady) {
    return <div>Loading...</div>;
  }

  return (
    <ParallaxProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <Suspense fallback={<div>Loading...</div>}>
                {user ? <Navigate to="/stanford" /> : <LoginPage onSignIn={signInWithGoogle} />}
              </Suspense>
            } 
          />
          <Route 
            path="/login" 
            element={
              <Suspense fallback={<div>Loading...</div>}>
                {user ? <Navigate to="/stanford" /> : <LoginPage onSignIn={signInWithGoogle} />}
              </Suspense>
            } 
          />
          <Route 
            path="/stanford" 
            element={
              <Suspense fallback={<div>Loading...</div>}>
                {user ? <MainPage user={user} onSignOut={handleSignOut} /> : <Navigate to="/login" />}
              </Suspense>
            } 
          />
          <Route path="/sitemap.xml" element={<Sitemap />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Suspense fallback={<div>Loading...</div>}>
          <Footer />
        </Suspense>
      </Router>
    </ParallaxProvider>
  );
};
export default App;