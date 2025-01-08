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
          setError("Please try again.");
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
          body: 'email=' + encodeURIComponent(email)
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
        <div className="NI__header-content__people">
        </div>
      </div>
    </div>
  );
};









const NewsletterSubscription = ({ user }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
        alert("Subscribed successfully!");
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
      {subscribed ? (
        <button
          className="subscribe-btn subscribed"
          onClick={() => setDropdownVisible(!dropdownVisible)}
        >
          Subscribed
        </button>
      ) : (
        <button className="subscribe-btn" onClick={handleSubscribe}>
          Subscribe
        </button>
      )}
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
  const [cachedEvents, setCachedEvents] = useState({});

  // Cache events in memory
  useEffect(() => {
    const eventCache = {};
    events.forEach(event => {
      eventCache[event.id] = event;
    });
    setCachedEvents(eventCache);
  }, [events]);

  const filteredEvents = useMemo(() => {
    const eventsList = Object.values(cachedEvents);
    return selectedField === 'all' 
      ? eventsList 
      : eventsList.filter(event => event.field === selectedField);
  }, [cachedEvents, selectedField]);

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








const MainPage = ({ user, onSignOut }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const EVENTS_PER_PAGE = 10;
  
  // Create a ref for intersection observer
  const observerRef = useRef();
  const loadingRef = useRef(null);

  const fetchEvents = async (lastDocument = null) => {
    if (!hasMore && lastDocument) return;
    
    setIsLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const paginationParams = {
        limit: EVENTS_PER_PAGE,
        lastDoc: lastDocument ? lastDocument.date._seconds : null
      };
      
      const response = await axios.get(`${apiUrl}/events`, { 
        params: paginationParams 
      });
      
      if (response.data.length < EVENTS_PER_PAGE) {
        setHasMore(false);
      }

      const filteredEvents = filterUpcomingEvents(response.data);
      
      setEvents(prevEvents => 
        lastDocument 
          ? [...prevEvents, ...filteredEvents]
          : filteredEvents
      );
      
      if (filteredEvents.length > 0) {
        setLastDoc(filteredEvents[filteredEvents.length - 1]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [target] = entries;
      if (target.isIntersecting && !isLoading && hasMore) {
        fetchEvents(lastDoc);
      }
    }, options);

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, hasMore, lastDoc]);

  useEffect(() => {
    let isMounted = true;

    const initialFetch = async () => {
      if (!isMounted) return;
      await fetchEvents();
    };

    initialFetch();
    
    const interval = setInterval(() => {
      if (isMounted) {
        fetchEvents();
      }
    }, 30000);

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
        <meta 
          name="description" 
          content="Discover and explore events happening at Stanford University. Your comprehensive guide to campus activities, talks, and more." 
        />
        <meta 
          name="keywords" 
          content="Stanford events, Stanford activities, Stanford student life, Stanford University" 
        />
      </Helmet>
      <div className="App">
        <div className="gradient__bg">
          <Navbar user={user} onSignOut={onSignOut} />
        </div>
        <h2>Your guide to everything happening at Stanford.</h2>
        <Header events={events} />
        <div ref={loadingRef} className="loading-trigger">
          {isLoading && <div className="loading-spinner">Loading events...</div>}
        </div>
      </div>
    </>
  );
};

const Footer = lazy(() => import('./containers/footer/Footer'));
const Sitemap = lazy(() => import('./sitemap.xml'));
const Modal = lazy(() => import('./components/ModalComponent'));
const NewsletterSection = lazy(() => import('./components/NewsletterSection'));

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
