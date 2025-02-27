import React, { useEffect, useRef } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { FiArrowUpRight } from "react-icons/fi";
import { FaPizzaSlice } from "react-icons/fa";
import { GiBoba } from "react-icons/gi";

const ModalComponent = ({ events, currentEventIndex, onClose, onNext, onPrevious }) => {
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

export default ModalComponent;