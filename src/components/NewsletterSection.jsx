// src/components/NewsletterSection.jsx
import React, { useState } from 'react';
import { auth, provider, signInWithPopup } from '../firebase';

const NewsletterSection = ({ isSticky }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      setError(null);
      try {
        const result = await signInWithPopup(auth, provider);
        const userEmail = result.user.email;
        
        if (email !== userEmail) {
          setError("Please try again.");
          setIsLoading(false);
          return;
        }
        
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
      </div>
    </div>
  );
};

export default NewsletterSection;
